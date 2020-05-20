import React from 'react';
import './UploadImage.css';

import {Storage, API, graphqlOperation } from 'aws-amplify';
import Predictions from '@aws-amplify/predictions';
import { createPicture } from '../graphql/mutations';
import awsExports from "../aws-exports";

class UploadImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            file : null
        }
    }
    
    addImageToDB = async (image) => {
        console.log('addimage to db')
        try {
            await API.graphql(graphqlOperation(createPicture, {input:image}));
        } catch (error) {
            console.log(error)
        }  
    }

    findImageLabels = async (file) => {
        console.log('find image labels');
        return Predictions.identify({
            labels: {
                source: {
                    file,
                },
                type: "LABELS"
            }
        })
        .then(response => {
            let labels = response.labels.map((label) => {
                if(label.metadata.confidence > 70)
                    return label.name
            });
            return labels.filter(Boolean);
        })
        .catch(err => console.log({ err }));
    }

    onChange(e) {
        const file = e.target.files[0];
        console.log(file);

        Storage.put(file.name, file, {
            contentType: 'image/png'
        }).then (() => {
            this.findImageLabels(file).then(labels => {
                this.setState({file: URL.createObjectURL(file)})

                const image = {
                    name: file.name,
                    labels: labels,
                    file: {
                        bucket: awsExports.aws_user_files_s3_bucket,
                        region: awsExports.aws_user_files_s3_bucket_region,
                        key: file.name
                    }
                }
                
                this.addImageToDB(image);
                console.log('added completed')
            })
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="UploadImage">
                <div>
                    <p>Please select an image to upload</p>
                    <input type="file" onChange={(evt) => this.onChange(evt)}/>
                </div>
                <div>
                    <img src={this.state.file}/>
                </div>
            </div>
        )
    }
}

export default UploadImage;
