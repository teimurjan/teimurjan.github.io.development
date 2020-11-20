---
layout: blog
title: "Digits Recognizer: from zero to an applicaiton."
date: 2019-11-26T09:35:31.085Z
excerpt: "Machine learning, computer vision, building APIs, creating front-end -
  that's all interesting. The question is: how to combine them all?"
hidden: false
tags:
  - python
  - javascript
  - machine learning
  - computer vision
  - reactjs
---
Machine learning, computer vision, building powerful APIs, and creating beautiful UIs - each topic here is an exciting area of engagement. The first couple requires more mathematics and science. API and UI development is about algorithmic thinking and designing flexible architectures. They are so different, so it becomes problematic to select the one you want to learn. The purpose of this article is to dispel all doubts and find out a subject matching you by using all of them.

The application that we're going to build is a simple digit recognizer.  You draw, the machine predicts. Simplicity is essential because it allows not to focus on details but to see the whole picture.

## Machine learning

One of the core parts of our app is the algorithm guessing the drawn number. Machine learning will be our tool to achieve a good guess quality. This kind of artificial intelligence allows a system to learn automatically with a given amount of data. In simple words, machine learning is a process of finding a coincidence or set of coincidences in the data to rely on them in guessing.

Our process contains three steps:

1. Get images of drawn digits for training.
2. Learn the system to guess the numbers via training data.
3. Test the system with new/unknown data.

### Environment

We'll need [a virtual environment](https://anaconda.org/anaconda/pythonhttps://docs.anaconda.com/anaconda/install/) to work with the machine learning in Python. It's an excellent tool that manages all the required Python packages, so you don't need to care about it. Let's install it with the following terminal commands:

```
python3 -m venv virtualenv
source virtualenv/bin/activate
```

### Training Model

There are some dependencies needed for creating our machine learning model.

* **sklearn.neighbors.KNeighborsClassifier** - is the classifier we'll use. K Nearest Neighbors Classifier is an algorithm which gets some data samples and arranges them on some plane ordered by a given set of characteristics:
* **sklearn.model_selection.train_test_split** - is the function that will help us split the data into the training data and the data to check the model's correctness.
* **sklearn.model_selection.cross_val_score** - is the function to get a mark for the model's correctness. The bigger value, the better correctness.
* **sklearn.metrics.classification_report** - is the function to show a statistical report of the model's guesses.
* **sklearn.datasets** - is the package to get data for training (images of digits).
* **numpy** - is the package widely used in science as it brings a productive and comfortable way to manipulate multi-dimensional data structures in Python.
* **matplotlib.pyplot** - is the package to visualize data.

After arranging data samples, the model is ready to guess. To detect the type of the green dot, we should check the types of **k** nearest neighbors where **k** is the argument set. Considering the image above, if **k** equal to 1, 2, 3, or 4, the guess will be **Red Triangle** as most of the green dot's closest **k** neighbors contain red triangles. If we increase **k** to 5, then the majority is of the blue squares, so that the guess will be **Blue Square**.
![](/media/knn3.png)

Let's start with installing all of them:

```
pip install sklearn numpy matplotlib scipy
```

Now we need to load MNIST Database, which is a dataset of digit images from **sklearn**.

```python
digits = datasets.load_digits()
```

When the data is fetched and ready, we can move to the next step of splitting the data into two parts: training and testing.

```python
(X_train, X_test, y_train, y_test) = train_test_split(
    digits.data, digits.target, test_size=0.25, random_state=42
)
```

The most important part of the machine learning process is starting right now. It's required to find the best parameter **k** for our cause. We can't just take the **k** out of our minds. We should evaluate the model with different values of **k**.

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

Executing this code will show you the following plot describing the algorithm's accuracy in respect of **k**.

![](/media/find-best-k.jpg)

As you can see, **k** equal to 3 gives the best accuracy.

## API

The application core (an algorithm predicting the digits from images) is ready. Now we need to decorate the algorithm with an API layer to make it available for usage. Let's use Flask web framework to have this job clean and concise.

We'll start by installing Flask and the dependencies related to the image processing in the virtual environment.

```sh
pip install Flask Pillow scikit-image
```

When the installation completes, we move to the creation of the app's entry point file.

```sh
mkdir app
touch app/__init__.py
```

The content of the file will look like:

```python
from flask import Flask
from app.views import PredictDigitView, IndexView

app = Flask(__name__)

app.add_url_rule(
    '/api/predict',
    view_func=PredictDigitView.as_view('predict_digit'),
    methods=['POST']
)

app.add_url_rule(
    '/',
    view_func=IndexView.as_view('index'),
    methods=['GET']
)

if __name__ == 'main':
  app.run()
```

You will get an error saying that `PredictDigitView` and `IndexView` are not defined. Here is the next step - creating a file that will initialize the views.

```python
from flask import render_template, request, Response
from flask.views import MethodView, View

from flask.views import View

from app.repo import ClassifierRepo
from app.services import PredictDigitService
from settings import CLASSIFIER_STORAGE

class IndexView(View):
    def dispatch_request(self):
        return render_template('index.html')

class PredictDigitView(MethodView):
    def post(self):
        repo = ClassifierRepo(CLASSIFIER_STORAGE)
        service = PredictDigitService(repo)
        image_data_uri = request.json['image']
        prediction = service.handle(image_data_uri)
        return Response(str(prediction).encode(), status=200)
```

Again an error with an unresolved import. The views package relies on three files we do not have:

* settings
* repo
* service

We'll implement them one by one.

Settings is a module with configurations and constant variables. It will store the path to the serialized classifier for us. It begs a logical question: why do I need to save the classifier? It's a simple way to improve the performance of your app. Instead of training the classifier every time you receive a request, we'll store a classifier's prepared version working out of the box.

```python
import os

BASE_DIR = os.getcwd()
CLASSIFIER_STORAGE = os.path.join(BASE_DIR, 'storage/classifier.txt')
```

The mechanism for setting, getting the classifier will be initialized in the next package on our list - repo. It's a class with two methods to retrieve and update the trained classifier using `pickle` Python built-in module.

```python
import pickle


class ClassifierRepo:
    def __init__(self, storage):
        self.storage = storage

    def get(self):
        with open(self.storage, 'wb') as out:
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

We almost made our API. It only lacks the service module. What's its purpose?

1. Get the trained classifier from storage.
2. Transform the image passed from UI to a format classifier understands.
3. Calculate the prediction with the formatted image via the classifier.
4. Return the prediction.

Let's code this algorithm:

```python
from sklearn.datasets import load_digits

from app.classifier import ClassifierFactory
from app.image_processing import process_image

class PredictDigitService:
    def __init__(self, repo):
        self.repo = repo

    def handle(self, image_data_uri):
        classifier = self.repo.get()
        if classifier is None:
            digits = load_digits()
            classifier = ClassifierFactory.create_with_fit(
                digits.data,
                digits.target
            )
            self.repo.update(classifier)
        
        x = process_image(image_data_uri)
        if x is None:
            return 0

        prediction = classifier.predict(x)[0]
        return prediction
```

The `PredictDigitService` has 2 dependencies: `ClassifierFactory` and `process_image`. 

We'll start by creating a class to create and train our model.

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

The API is up for it. Let's move to the image processing step.

## Image processing

To set up the image processor, we need to create lots of functions to convert the raw image to the classifier input type.

![](/media/vis.png)

There will be six functions:

1. Replace a transparent background with a color.

![](/media/replace_transparent_background.png)

```python
def replace_transparent_background(image):
    image_arr = np.array(image)

    if len(image_arr.shape) == 2:
        return image

    alpha1 = 0
    r2, g2, b2, alpha2 = 255, 255, 255, 255

    red, green, blue, alpha = image_arr[:, :, 0], image_arr[:, :, 1], image_arr[:, :, 2], image_arr[:, :, 3]
    mask = (alpha == alpha1)
    image_arr[:, :, :4][mask] = [r2, g2, b2, alpha2]

    return Image.fromarray(image_arr)
```

2. Trim open borders.

![](/media/trim_borders.png)

```python
def trim_borders(image):
    bg = Image.new(image.mode, image.size, image.getpixel((0,0)))
    diff = ImageChops.difference(image, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return image.crop(bbox)
    
    return image
```

3. Add borders of equal size.

![](/media/pad_image.png)

```python
def pad_image(image):
    return ImageOps.expand(image, border=30, fill='#fff')
```

4. Convert the image to grayscale mode.

```python
def to_grayscale(image):
    return image.convert('L')
```

5. Invert colors.

![](/media/invert_colors.png)

```python
def invert_colors(image):
    return ImageOps.invert(image)
```

6. Resize the image to 8x8 format.

![](/media/resize_image.png)

```python
def resize_image(image):
    return image.resize((8, 8), Image.ANTIALIAS)
```

Now you can test the app. Run the application and send an image in base64 format. (download [this image](http://training.databricks.com/databricks_guide/digit.png), then convert it to base64 using [this resource](https://www.base64-image.de/), copy the code and save it in the file called `test_request.json` under the `image` key).

```sh
export FLASK_APP=app && flask run
```

```sh
curl 'http://localhost:5000/api/predict' -X "POST" -H "Content-Type: application/json" -d @test_request.json -i && echo -e '\n\n'
```

You should see the following output.

```
curl 'http://localhost:5000/api/predict' -X "POST" -H "Content-Type: application/json" -d @test_request.json -i && echo -e '\n\n'
HTTP/1.1 100 Continue

HTTP/1.0 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1
Server: Werkzeug/0.14.1 Python/3.6.3
Date: Tue, 27 Mar 2018 07:02:08 GMT

4
```

Great, our web app correctly detected that it is 4.

## UI

I used [CRA boilerplate](https://github.com/facebook/create-react-app) but you can configure your application from scratch if you don't cherish the time.

```sh
create-react-app frontend
cd frontend
```

After setting up React environment we also need one more dependency for drawing. My choice fell on [react-sketch](https://github.com/tbolis/react-sketch). It perfectly matches my needs.

```sh
npm i react-sketch
```

Tools are ready and let's write the code.

```jsx
import React, { useRef, useState } from "react";
import { SketchField, Tools } from "react-sketch";

import { makePrediction } from "./api";

import logo from "./assets/logo.svg";
import "./assets/App.css";

const pixels = (count) => `${count}px`;
const percents = (count) => `${count}px`;

const MAIN_CONTAINER_WIDTH_PX = 200;
const MAIN_CONTAINER_HEIGHT = 100;
const MAIN_CONTAINER_STYLE = {
  width: pixels(MAIN_CONTAINER_WIDTH_PX),
  height: percents(MAIN_CONTAINER_HEIGHT),
  margin: "0 auto",
};

const SKETCH_CONTAINER_STYLE = {
  border: "1px solid black",
  width: pixels(MAIN_CONTAINER_WIDTH_PX - 2),
  height: pixels(MAIN_CONTAINER_WIDTH_PX - 2),
  backgroundColor: "white",
};

const App = () => {
  const sketchRef = useRef(null);
  const [errors, setErrors] = useState();
  const [value, setValue] = useState();
  const [prediction, setPrediction] = useState();

  const handleSubmit = () => {
    const image = sketchRef.current.toDataURL();

    setPrediction(undefined);
    setErrors(undefined);

    makePrediction(image).then(setPrediction).catch(setErrors);
  };

  const handleClear = (e) => sketchRef.current.clear();

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="App" style={MAIN_CONTAINER_STYLE}>
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Draw a digit</h1>
        </header>
        <div style={SKETCH_CONTAINER_STYLE}>
          <SketchField
            ref={sketchRef}
            onChange={handleChange}
            width="100%"
            height="100%"
            tool={Tools.Pencil}
            imageFormat="jpg"
            lineColor="#111"
            lineWidth={10}
            value={value}
          />
        </div>
        {prediction && <h3>Predicted value is: {prediction}</h3>}
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSubmit}>Guess the number</button>
        {errors && <p style={{ color: "red" }}>Something went wrong</p>}
      </div>
    </div>
  );
};

export default App;
```

```sh
npm run start
```

And go to the `localhost:3000`.

<div align="center" style="margin:1rem auto;">

![](/media/guess.gif)

</div>

Check out the [DEMO](web-digits-recognizer.herokuapp.com). All code is available on my [Github repository ](https://github.com/teimurjan/digits-recognizer).

### Conclusion

I understand that the quality of this classifier is not so good as you want. That's it because of the big difference between the training and the actual data. But the reason for creating this project is just to learn something new and share this knowledge with others. Thank you for reading this article, hope you've discovered lots of interesting things, keep on studying and improve yourselves. 🙌