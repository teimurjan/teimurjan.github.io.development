---
layout: blog
title: 'Digits Recognizer: from zero to an applicaiton.'
date: 2019-11-26T09:35:31.085Z
excerpt: >-
  Machine learning, computer vision, building APIs, creating front-end - that's
  all interesting. The question is: how to combine them all?
hidden: false
tags:
  - python
  - javascript
  - machine learning
  - computer vision
  - reactjs
---
Machine learning, computer vision, building APIs, creating UI - each of them is a hugely interesting area of engagement. Machine learning and computer vision are more of mathematics and science when API and UI development are about algorithmic thinking and designing flexible architectures. They are so different so it becomes difficult when you have to select the best one to dive into. The purpose of this article is to dispel all doubts and find out a featured scope for you by combining all of them.

The application that is going to be built is simple enough. Simplicity is the core idea as making the app big and compound won't get you a good feeling about any topic but will make you be afraid of its complexity. So the aim of the app is to guess the digits you're drawing in your browser, that's it.

## Machine learning

One of the core parts in our app is the algorithm guessing what number is drawn. This algorithm will be designed using machine learning. Machine learning is a kind of artificial intelligence allowing a system to learn automatically with a given amount of data. In simple words, machine learning is a process of finding a coincidence or set of coincidences in the data during training to apply the found coincidence rules in guessing.

Our app will use ML in the following way:

1. Take images of drawn digits for training.
2. Learn the system to guess the digits via training data.
3. Test the system for guessing new/unknown data.

### Setting up environment

We'll need [Anaconda](https://anaconda.org/anaconda/python) to work with ML in Python. It's a nice tool that installs all the required Python packages so you don't need to install them separately by yourself.

### Import dependencies

```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report
from sklearn import datasets
import numpy as np
import matplotlib.pyplot as plt
import cv2
```

### Prepare data

The dataset from [MNIST Database](http://yann.lecun.com/exdb/mnist/) is available in the datasets module of sklearn, so let's start with loading the data.

```python
digits = datasets.load_digits()
```

Now we need to have two different datasets: one for testing and the other for training our model.

```python
(X_train, X_test, y_train, y_test) = train_test_split(
    digits.data, digits.target, test_size=0.25, random_state=42
)
```

### Fit the model

Let’s find the best parameter k. We can’t just take the k out of our mind, so let’s train model and evaluate accuracy for different k.

```python
ks = np.arange(2, 10)
scores = []
for k in ks:
    model = KNeighborsClassifier(n_neighbors=k)
    score = cross_val_score(model, X_train, y_train, cv=5)
    score.mean()
    scores.append(score.mean())
plt.plot(scores, ks)
plt.xlabel('accuracy')
plt.ylabel('k')
```

As the output we can see such a plot:

![](/media/find-best-k.jpg)

Looking at this chart we can understand that the best accuracy was reached when k was 3.
So from now, we'll be using k=3 for our model.

### Evaluate the model on the test data

```python
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)

z = model.predict(X_test)
```

Let's now create a classification report to see the accuracy.

```python
print(classification_report(y_test, z))
```

![](/media/classification-score.png)

Isn't it amazing that we reached 99% accuracy?

## Building API

As we'll build the application from scratch we need to create a virtual environment in order to incapsulate all our dependencies. Let's create python3 virtual environment.

```sh
python3 -m venv venv
source venv/bin/activate
```

Now we have the environment and we can install all needed dependencies.

```sh
pip install flask flask-script scipy scikit-image numpy pillow
```

That's all about setting up the environment.

### Configure application

We need the ability of running our application without setting env variables everytime. This goal can be achieved using [flask-script](https://flask-script.readthedocs.io/en/latest/) package. At first we should create a file called manage.py

```sh
touch manage.py
```

Next step is getting this manage.py ready.

```python
from flask_script import Manager
from app import create_app

app = create_app()
manager = Manager(app)


@manager.command
def runserver():
    app.run(debug=True, host='0.0.0.0', port=5000)


if __name__ == '__main__':
    manager.run()
```

As you see there is an unknown function create_app inside the app package. Now we'll make this function known. I start from creating the package.

```sh
mkdir app
touch app/__init__.py
```

And then make the target function

```python
from flask import Flask


def create_app():
    app = Flask(__name__)
    return app
```

It's now our app ready and can be run by calling.

```sh
python3 manage.py runserver
```

### Add storage

As we'll deal with the kNN classifier we need to remember the clusters after the training process. The simplies way is to store serialized version of the classifier in a file. Let's create this file.

```sh
mkdir storage
touch storage/classifier.txt
```

### Create settings file

Finally we need to create settings file where we'll have the paths of the application's base directory and the classifier storage.

```sh
touch settings.py
```

The file’s content is

```python
import os

BASE_DIR = os.getcwd()
CLASSIFIER_STORAGE = os.path.join(BASE_DIR, 'storage/classifier.txt')
```

### Make handlers

The first step is to specify handlers for incoming requests. We'll develop a SPA so the first handler will always return index.html page.

```python
def create_root_view(app):
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def root(path):
        return render_template("index.html")
```

Besides this view we also must create an API endpoint for predictions. For now we’ll just pass handling the request, but return here afterwards.

```python
class PredictDigitView(MethodView):
    def post(self):
        pass
```

### Construct the prediction logic

For our prediction view we need 2 things: image processor and kNN classifier. As we’ve [already trained our classifier](https://teimurjan.github.io/blog/digits-recognizer-python-flask-react-1/) the only thing to realize is the image processing.

Image processor will be represented by the lots of functions to convert our image from data URI to the flat numpy array of the 8x8 grayscale image with intensity form 0 to 16(like the original ones from the digits dataset).

Firstly we need to convert image from data URI to the Image object.

```python
import numpy as np
from skimage import exposure
import base64
from PIL import Image
from io import BytesIO


def data_uri_to_image(uri):
    encoded_data = uri.split(',')[1]
    image = base64.b64decode(encoded_data)
    return Image.open(BytesIO(image))
```

Then because of the specificity of our front end(will see it later) we need to replace the image background from transparent to white.

```python
def replace_transparent_background(image):
    image_arr = np.array(image)
    alpha1 = 0
    r2, g2, b2, alpha2 = 255, 255, 255, 255

    red, green, blue, alpha = (
        image_arr[:, :, 0],
        image_arr[:, :, 1],
        image_arr[:, :, 2],
        image_arr[:, :, 3]
    )
    mask = (alpha == alpha1)
    image_arr[:, :, :4][mask] = [r2, g2, b2, alpha2]

    return Image.fromarray(image_arr)
```

Another thing to do is avoid from the white frame of the image and replace it with the small one just like in the test data. We’ll do it in 2 steps:

* Remove the whole frame

```python
def crop_image_frame(image, color=255):
    image_arr = np.array(image)
    cropped_image_arr = image_arr[~np.all(image_arr == color, axis=1)]
    cropped_image_arr = cropped_image_arr[:, ~np.all(cropped_image_arr == color, axis=0)]
    return Image.fromarray(cropped_image_arr)
```

* Add the frame that we need

```python
def pad_image(image, height=0, width=30, color=255):
   return Image.fromarray(np.pad(
       np.array(image),
       ((height, height), (width, width)),
       'constant',
       constant_values=color
   ))
```

After that let’s resize the image to 8x8 format.

```python
def resize_image(image):
    return image.resize((8, 8), Image.ANTIALIAS)
```

The original images’ features show the intensity of gray color from 0 to 16. To reach this gain we have only rescale_intensity function which just change the scale of our image. So, in our case if we have a pixel with the value 255(white) it will be scaled into 16. But the intensity of gray color is 0 in white. That’s why we need to invert white to 0(black) and only after that change the intensity scale.

```python
def white_to_black(image):
    image_arr = np.array(image)
    image_arr[image_arr > 230] = 0
    return Image.fromarray(image_arr)


def to_flat_grayscaled_image_arr(image):
    image_arr = np.array(image)
    image_arr = exposure.rescale_intensity(image_arr, out_range=(0, 16))
    return image_arr.flatten()
```

Now we can combine all the image utils together. The only addition is to convert the image from RGB to L format. So all RGB pixels will be aggregated by the formula: L = R  _299/1000 + G_  587/1000 + B * 114/1000.

```python
def to_classifier_input_format(data_uri):
    raw_image = data_uri_to_image(data_uri)
    image_with_background = replace_transparent_background(raw_image)
    grayscaled_image = image_with_background.convert('L')
    cropped_image = crop_image_frame(grayscaled_image)
    padded_image = pad_image(cropped_image)
    inverted_image = white_to_black(padded_image)
    resized_image = resize_image(inverted_image)
    return np.array([
        to_flat_grayscaled_image_arr(resized_image)
    ])
```

### Handle the request

The first thing to do is to create the repo for getting and updating our classifier.

```python
import pickle


class ClassifierRepo:
    def __init__(self, storage):
        self.storage = storage

    def get(self):
        with open(self.storage, 'rb') as out:
            try:
                classifier_str = out.read()
                if classifier_str != '':
                    return pickle.loads(classifier_str)
                else:
                    return None
            except Exception:
                return None

    def update(self, classifier):
        with open(self.storage, 'wb') as in_:
            pickle.dump(classifier, in_)
```

Also we need a factory to create the fitted classifier.

```python
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier


class ClassifierFactory:
    @staticmethod
    def create_with_fit(data, target):
        model = KNeighborsClassifier(n_neighbors=3)
        model.fit(data, target)
        return model
```

It’s almost done. The only thing to finish our view is to gather all the things above into a service.

```python
from sklearn.datasets import load_digits

from app.classifier import ClassifierFactory
from app.utils import to_classifier_input_format


class PredictDigitService:
    def __init__(self, repo):
        self.repo = repo

    def handle(self, image_data_uri):
        classifier = self.repo.get()
        if classifier is None:
            digits = load_digits()
            classifier = ClassifierFactory.create(
                digits.data, digits.target
            )
            self.repo.update(classifier)
        x = to_classifier_input_format(image_data_uri)
        prediction = classifier.predict(x)[0]
        return prediction
```

So, let's add this service in our view.

```python
class PredictDigitView(MethodView):
    def post(self):
        repo = ClassifierRepo(CLASSIFIER_STORAGE)
        service = PredictDigitService(repo)
        image_data_uri = request.json['image']
        prediction = service.handle(image_data_uri)
        return Response(str(prediction).encode(), status=200)
```

And initialize handlers by calling this function inside the **create_app**.

```python
def init_urls(app):
    app.add_url_rule(
        '/api/predict',
        view_func=PredictDigitView.as_view('predict_digit'),
        methods=['POST']
    )
    create_root_view(app)
```

So the final version of \_\_init\_\_.py inside the app folder

```python
from flask import Flask
from .urls import init_urls


def create_app():
    app = Flask(__name__)
    init_urls(app)
    return app
```

### Testing

Now you can test our app. Let's run the application

```sh
python3 manage.py runserver
```

And send an image in base64 format. You can do it by downloading [this image](http://training.databricks.com/databricks_guide/digit.png), then convert it to base64 using [this resource](https://www.base64-image.de/), copy the code and save it in the file called test_request.json. Now we can send this file to get a prediction.

```sh
curl 'http://localhost:5000/api/predict' -X "POST" -H "Content-Type: application/json" -d @test_request.json -i && echo -e '\n\n'
```

You should see the following output.

```
(venv) Teimurs-MacBook-Pro:digits-recognizer teimurgasanov$ curl 'http://localhost:5000/api/predict' -X "POST" -H "Content-Type: application/json" -d @test_request.json -i && echo -e '\n\n'
HTTP/1.1 100 Continue

HTTP/1.0 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1
Server: Werkzeug/0.14.1 Python/3.6.3
Date: Tue, 27 Mar 2018 07:02:08 GMT

4
```

As you see our web app correctly detected that it is 4.

### Final result

You can find the code from this article in my [Github repository](https://github.com/teimurjan/digits-recognizer).

## Developing UI

I used [CRA boilerplate](https://github.com/facebook/create-react-app) but it's not so important. You can configure your application from scratch if you don't cherish the time.

```sh
create-react-app frontend
cd frontend
```

So after setting up React environment we also need one more dependency for drawing. My choice fell on [react-sketch](https://github.com/tbolis/react-sketch). It perfectly matches our needs.

```sh
npm i react-sketch
```

Now we have everything to make up our drawer.

### Implement the app

The whole App can be written in just 80 lines of code. 🙂

```js
import React, { Component } from "react";
import logo from "./assets/logo.svg";
import "./assets/App.css";
import { SketchField, Tools } from "react-sketch";
import { makePrediction } from "./api";

const pixels = count => `${count}px`;
const percents = count => `${count}px`;

const MAIN_CONTAINER_WIDTH_PX = 200;
const MAIN_CONTAINER_HEIGHT = 100;
const MAIN_CONTAINER_STYLE = {
  width: pixels(MAIN_CONTAINER_WIDTH_PX),
  height: percents(MAIN_CONTAINER_HEIGHT),
  margin: "0 auto"
};

const SKETCH_CONTAINER_STYLE = {
  border: "1px solid black",
  width: pixels(MAIN_CONTAINER_WIDTH_PX - 2),
  height: pixels(MAIN_CONTAINER_WIDTH_PX - 2),
  backgroundColor: "white"
};

class App extends Component {
  state = {
    prediction: undefined,
    errors: undefined
  };

  handleSubmit = e => {
    const image = this.sketch.toDataURL();
    this.setState({
      prediction: undefined,
      errors: undefined
    });
    makePrediction(image)
      .then(prediction => this.setState({ prediction }))
      .catch(errors => this.setState({ errors }));
  };

  handleClear = e => this.sketch.clear();

  render() {
    const { prediction, errors } = this.state;
    return (
      <div className="App" style={MAIN_CONTAINER_STYLE}>
        <div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Draw a digit</h1>
          </header>
          <div style={SKETCH_CONTAINER_STYLE}>
            <SketchField
              ref={sketch => (this.sketch = sketch)}
              width="100%"
              height="100%"
              tool={Tools.Pencil}
              imageFormat="jpg"
              backgroundColor="white"
              lineColor="gray"
              lineWidth={8}
            />
          </div>
          {prediction && <h3>Predicted value is: {prediction}</h3>}
          <button onClick={this.handleClear}>Clear</button>
          <button onClick={this.handleSubmit}>Guess the number</button>
          {errors && <p style={{ color: "red" }}>Something went wrong</p>}
        </div>
      </div>
    );
  }
}

export default App;
```

Here is no unfamiliar things, I guess, except the `SketchField` component. It has props which are perfectly named, so as you see we have width and height attributes, the tool with which we'll draw our image, its format, the colors of background and pencil and also the width of line. But I did not say anything about `ref`. It is used here in order to get our image. So we assign SketchField ref to `this.sketch` and then when "Submit" button is clicked we can get the drawen image by calling `.toDataURL()`.

One more unknown thing is `makePrediction` function. It is a simple API call with status code validation.

```js
const validateStatusCode = response =>
  new Promise((resolve, reject) => {
    const status = response.status;
    const next = status < 400 ? resolve : reject;
    response.text().then(next);
  });

export const makePrediction = image =>
  fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image })
  }).then(validateStatusCode);
```

### Test the app

Let's now test our application. Start it with:

```sh
npm run start
```

And go to the `localhost:3000`.

<div align="center" style="margin:1rem auto;">

![](/media/guess.gif)

</div>

Checkout the [DEMO](web-digits-recognizer.herokuapp.com). All code is available on my [Github repository ](https://github.com/teimurjan/digits-recognizer).

### Conclusion

I understand that the quality of this classifier is not so good as you want. That's it because of the big difference between train and actual data. But the reason of creating this project is just to learn something new and share this knowledge with others. Thank you for reading this article, hope you've discovered lots of interesting things, keep on studying and improve yourselves. 🙌
