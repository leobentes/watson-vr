## Installation
1. Clone **git://github.com/leobentes/watson-vr** reposistory
2. cd to ***watson-vr/watson-vr-node/***
2. Install IBM Watson VR libraries via ***npm install ibm-watson@^5.6.0***

## Configuration
1. Create a folder named ***results*** under ***watson-vr-node***
2. Create a folder named ***config*** under ***watson-vr-node***
3. Create a file named ***wvr_config.json*** under ***config***, as the example below, to insert your Watson VR service **APIKEY** and **URL**, and your Visual Recognition **Model ID** (classifierIds)

~~~
{
    "credentials" : {
    "apikey" : "replace_with_your_watson_vr_api_key",
        "url": "replace_with_your_watson_vr_url"
    },
    "classifierIds" : ["replace_with_classification_model_id"]
}
~~~

## Classification
Execute ***custom_classifier.js*** passing as parameter either one image file or a zip achive containing up to 20 images.

~~~
node custom_classifier.js files_to_test.zip
~~~

Optionally you can pass the desired classification threshold (default is 0.5).

~~~
node custom_classifier.js my_image.jpg 0.7
~~~

The results will be recorded to a JSON file inside ***./results*** folder. 

## Reading results
In order to read results just open the generated JSON using your prefered file editor. If you want to use the provided ***read_results.js*** script, your images file must be named with a leading **0** if the image does not belong to any classes, or **1** if the image belongs to a class. In case of **1**, the expected class name shoud appear between dashes, as the following examples:

(a) **1-dog-whataver_dog_image_name.jpg**<br>
(b) **1-cat-whatever_cat_image_name.jpg**<br>
(c) **0--whataver_other_no_dog_cat_image_name.jpg**<br>

(a) It's an image that is expected to be classified as **dog**<br>
(b) It's an image that is expected to be calssified as **cat**<br>
(c) It's an image that should not be classified neither as **dog** nor **cat** or any other class available in the model (notice the double dashes).

In case your classification submission followed the image naming convention above, just execute:

~~~
node read_results.js results/result_filename.json
~~~

