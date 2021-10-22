import { Grid, makeStyles, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import color_red from '../../../images/colors/color01.png';
import color_orange from '../../../images/colors/color02.png';
import color_yellow from '../../../images/colors/color03.png';
import color_green from '../../../images/colors/color04.png';
import color_blue from '../../../images/colors/color05.png';
import color_purple from '../../../images/colors/color06.png';
import ImageIcon from '@material-ui/icons/Image';
import CloseIcon from '@material-ui/icons/Close';
import { PropTypes } from 'prop-types';



const useStyles = makeStyles((theme) => ({
    box_uplodeIcon: {
        borderStyle: 'dotted',
        borderWidth: 2,
        color: '#1760AD',
        height: 100,
        width: 100,
    },
    box_uplodeImage: {
        height: 220,
        width: 180,
    },
    closeIcon: {
        color: '#ff6464',
        cursor: 'pointer',
        fontSize: 'small'
    },
    icon: {
        color: '#1760AD',
        cursor: 'pointer',
        fontSize: 50
    },
    image: {
        height: 100,
        textAlign: 'center',
    },
    img: {
        backgroundSize: 'cover',
        display: 'block',
        margin: 'auto',
        maxHeight: '100%',
        maxWidth: '100%',
    },
    item: {
        width: '110px',
        fontSize: '14px',
        position: 'relative',
        height: '110px',
    }
}));

export default function ImageSection(props) {
    const { onImageSelected, imageUrl } = props;
    const classes = useStyles();
    const [fileImage, setFileImage] = useState(imageUrl);
    const [image, setImage] = useState();

    const imageAssetColors = [
        color_red,
        color_orange,
        color_yellow,
        color_green,
        color_blue,
        color_purple,
    ];

    const handleUploadFileImage = (event) => {
        setFileImage(URL.createObjectURL(event.target.files[0]));
        getEmergencyFoundImg(event.target.files[0]);
    }
    const handleCloseUploadFileImage = () => {
        setFileImage('');
        onImageSelected(null);
    }

    const getEmergencyFoundImg = (fileImage) => {
        const fileType = fileImage.name.split('.');
        const fileReader = new FileReader();
        fileReader.onload = () => {
            checkTypeImage(fileReader.result, fileType[1]);
        };
        fileReader.onerror = (error) => {
            console.log(error);
        };
        fileReader.readAsDataURL(fileImage);
    };
    const handleSelectedImageColor = (colorPath) => {
        setFileImage(colorPath);
        checkTypeImage(colorPath, 'png')
    };

    const checkTypeImage = (imageBase64, imageType) => {
        if (imageUrl) {
            onImageSelected({});
        }


        if (imageBase64 && imageType) {
            setImage({ 'base64': imageBase64, 'type': imageType });
            onImageSelected({ 'base64': imageBase64, 'type': imageType });

        }
    }

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={3}>

                    {fileImage ? (
                        <Grid container className={classes.item} >
                            <Grid
                                alignItems="flex-start"
                                className={classes.image}
                                container
                                direction="column"
                                item
                                justify="flex-start"
                                sm={12}
                                xs={12}
                            >
                                <Button component="label">
                                    <input
                                        hidden
                                        onChange={handleUploadFileImage}
                                        type="file"
                                    />
                                    <img alt={fileImage.name} className={classes.img} src={fileImage} height="100px" width='100px' style={{ objectFit: 'cover' }} />
                                </Button>
                                <CloseIcon
                                    className={classes.closeIcon}
                                    onClick={() => handleCloseUploadFileImage()}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <Button className={classes.box_uplodeIcon} component="label">
                            <input
                                hidden
                                onChange={handleUploadFileImage}
                                type="file"
                            />
                            <ImageIcon className={classes.icon} />
                        </Button>
                    )}
                </Grid>
                <Grid item xs={9} >
                    {imageAssetColors.map((color) => <Button component="label" onClick={() => handleSelectedImageColor(color)}><img src={color} alt={color} width={60} height={60} /></Button>)}
                </Grid>
            </Grid>
        </div>
    )
}
ImageSection.propTypes = {
    onImageSelected: PropTypes.func.isRequired,
    imageUrl: PropTypes.object.isRequired,
}

