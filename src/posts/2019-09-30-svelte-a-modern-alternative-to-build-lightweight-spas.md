---
layout: blog
title: Svelte - a modern alternative to build lightweight SPAs.
date: 2019-09-30T07:15:09.723Z
excerpt: "The most popular tools like React and Angular are the indisputable leaders in\t  the front-end development. But what if there is a faster lighter tool compilable to vanilla JS? Explore the new Svelte tool with the real-world examples.\t"
hidden: true
tags:
  - svelte
  - javascript
  - spa
canonical_url: 'https://www.toptal.com/front-end/svelte-framework-guide'
---
Web applications are becoming more popular day by day. They’re a growing world which people choose for its simplicity, speed, and cross-platform availability. Single Page Applications (SPAs) have taken a huge part in this process. Frameworks like Angular, Vue.js, and React help developers to deliver the best user experience in a short period leaving the code supportable and extendable. These tools have long remained most popular in the field, with many advantages over the newly created packages. It has felt like an oligopoly in the SPA world. However, a group of forward-looking developers targeting this market could enter with a serious competitor-Svelte.

Svelte is a new approach to building user interfaces. Let’s dive in and explore what makes it so fresh by creating a common log-in form.

# Architecture

Svelte is architected to be faster than any other library. It’s reached by shifting the step of loading a framework for building a virtual DOM. Instead of using a tool during the running process, it’s compiled to vanilla JS at the building stage so the application requires no dependencies to start.

![](/media/1-tgu3z9x9usrchgkf4sywiq.png)

The table above describes why Svelte is an absolute winner in startup performance. That’s not gained by any sort of optimization but by using the available browser JavaScript compiler instead of a side compiler.

# Installation

Svelte installation is incredibly easy, making its usage very pleasant. The first step is to download the project’s template:

```sh
npx degit sveltejs/template svelte-login-form	
```

Completing the above command means that we have a Svelte project template. It’s empty for the moment and the required NPM packages are not installed yet. Let’s fix that.

```sh
cd svelte-login-form	
npm install	
```

Now the application is ready to start by using the following command:

```sh
npm dev start	
```

# Structure

Any Svelte component may contain the following sections:

* Script	
* Style	
* Template	

Let’s look at the example in the `src/App.svelte` file.	

```html
<script>	
  export let name;	
</script>	

<style>	
  h1 {	
    color: purple;	
  }	
</style>	

<h1>{name}</h1>	
```

The code above is contained from exactly three sections:

1.  `script` tag, which is an optional JavaScript block with the variables and functions declarations that should be used inside the component.
2. `style` tag, which is another optional block. It's much like a common HTML style tag except for one important difference. The rules described inside this block are scoped to only this component. Applying a style to a `p` element won't affect all the paragraphs on the page. It's fantastic since you do not have to come up with class names and you'll never accidentally override another rule.
3. The last and the only required block is a template block — in this case, an `h1` tag. It's a presentation/view of your component. It's tightly bound to the style and script blocks as they determine how the view will be styled and how it will behave.

Svelte is a library trying to bring modularity into the front-end game. It keeps that modularity not only in separating different components but also in isolating the logic, view, and the template.

Returning to the log-in form we’re building, let’s create a new file `LoginForm.svelte` inside the src folder with the following content:

```html
<style>	
  form {	
    background: #fff;	
    padding: 50px;	
    width: 250px;	
    height: 400px;	
    display: flex;	
    flex-direction: column;	
    justify-content: center;	
    align-items: center;	
    box-shadow: 0px 20px 14px 8px rgba(0, 0, 0, 0.58);	
  }	
  label {	
    margin: 10px 0;	
    align-self: flex-start;	
    font-weight: 500;	
  }	
  input {	
    border: none;	
    border-bottom: 1px solid #ccc;	
    margin-bottom: 20px;	
    transition: all 300ms ease-in-out;	
    width: 100%;	
  }	
  input:focus {	
    outline: 0;	
    border-bottom: 1px solid #666;	
  }	
  button {	
    margin-top: 20px;	
    background: black;	
    color: white;	
    padding: 10px 0;	
    width: 200px;	
    border-radius: 25px;	
    text-transform: uppercase;	
    font-weight: bold;	
    cursor: pointer;	
    transition: all 300ms ease-in-out;	
  }	
  button:hover {	
    transform: translateY(-2.5px);	
    box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.58);	
  }	
  h1 {	
    margin: 10px 20px 30px 20px;	
    font-size: 40px;	
  }	
</style>	


<form>	
  <h1>👤</h1>	

  <label>Email</label>	
  <input name=”email” placeholder=”name@example.com” />	

  <label>Password</label>	
  <input name=”password” type=”password” placeholder=”password” />	

  <button type="submit">Log in 🔒</button>	
</form>	
```

It’s a dumb styled component that we’ll make smarter later. To see this component on our site we should render it inside the root component — App. Let’s go and edit the `src/App.svelte` so it'll look like this:

```html
<script>	
  import LoginForm from "./LoginForm.svelte";	
</script>	

<style>	
  section {	
    height: 100vh;	
    width: 100%;	
    display: flex;	
    justify-content: center;	
    align-items: center;	
    background: linear-gradient(to right, #cd76e2, #e358ab);	
  }	
</style>	

<section>	
  <LoginForm />	
</section>	
```

If everything has been done correctly and the application is still running, our form will appear at [localhost:5000](http://localhost:5000). Let's level up our Svelte skills by making the form smarter.

# Going stateful

Any component in Svelte can have its state. The state is a special variable or a group of special variables which can be used inside the template. Why do I say “special”? Whenever such a variable is changed the template is notified about it and renders the content with the newest state. This allows the application to react to user interactions very fast.

We’ll declare `email` and `password` state variables where the form values for the appropriate fields will be stored. It means that our `email` and `password` variables will always be in sync with the form values, so we'll be ready to submit these values at any time with no fear of having any differences between the submission values and the actual values in the form.

```html
<script>	
  let email = "";	
  let password = "";	
  let isLoading = false;	
  const handleSubmit = () => {	
      isLoading = true;	
      // Simulate network request	
      setTimeout(() => {	
        isLoading = false;	
        // Authorize the user	
      }, 1000);	
  };	
</script>	

<style>	
/* Style is unchanged */	
</style>	


<form on:submit|preventDefault={handleSubmit}>	
  <h1>👤</h1>	

  <label>Email</label>	
  <input name="email" placeholder="name@example.com" bind:value={email} />	

  <label>Password</label>	
  <input name="password" type="password" bind:value={password} />	


    {#if isLoading}Logging in...{:else}Log in 🔒{/if}	
</form>	
```

State variables look like common JavaScript variables but to make them synchronized with the form values (bind them to the form fields), it is necessary to use bind:value directive. There are also a couple of unfamiliar things:

* `on:submit|preventDefault` is shorthand for preventing default events' behavior. It's more comfortable this way than having to write `e.preventDefault()` every time.
* `{#if isLoading}Logging in...{:else}Log in 🔒{/if}` is a piece of Svelte's template syntax. As there is no JS in the template block, there is a special syntax for using ifs, loops, etc.

Finally, let’s use the available options by using the state to add validation to our form. It can be achieved by creating another state variable `errors`, which will be filled with errors when the form is submitted with invalid values.

```html
<script>	
  let email = "";	
  let password = "";	
  let isLoading = false;	
  let errors = {};	
  const handleSubmit = () => {	
    errors = {};	
    if (email.length === 0) {	
      errors.email = "Field should not be empty";	
    }	
    if (password.length === 0) {	
      errors.password = "Field should not be empty";	
    }	
    if (Object.keys(errors).length === 0) {	
      isLoading = true;	
      // Simulate network request	
      setTimeout(() => {	
        isLoading = false;	
        // Authorize the user	
      }, 1000);	
    }	
  };	
</script>	

<style>	
  // Previous styles unchanged	
  .errors {	
    list-style-type: none;	
    padding: 10px;	
    margin: 0;	
    border: 2px solid #be6283;	
    color: #be6283;	
    background: rgba(190, 98, 131, 0.3);	
  }	
</style>	

<form on:submit|preventDefault={handleSubmit}>	
  <h1>👤</h1>	

  <label>Email</label>	
  <input name="email" placeholder="name@example.com" bind:value={email} />	

  <label>Password</label>	
  <input name="password" type="password" bind:value={password} />	

  <button type="submit">	
    {#if isLoading}Logging in...{:else}Log in 🔒{/if}	
  </button>	

  {#if Object.keys(errors).length > 0}	
    <ul class="errors">	
      {#each Object.keys(errors) as field}	
        <li>{field}: {errors[field]}</li>	
      {/each}	
    </ul>	
  {/if}	
</form>	
```

<div align="center">	

<div style="width:60%">	

![](/media/1-lzdwkog39ylrrlie2j5wsa.gif)

</div>	

</div>	

The form is almost complete. The only thing that remains is a success message upon successful authentication.

Let’s create a state variable for tracking successful submissions which is `false` by default. After successful submission of a form, the value of this variable should be set to `true`.

```js
let isSuccess = false;	
```

The function handling the form submission should also be changed to follow the logic of toggling `isSuccess` after a successful operation.

```js
const handleSubmit = () => {	
  errors = {};	
  if (email.length === 0) {	
    errors.email = "Field should not be empty";	
  }	
  if (password.length === 0) {	
    errors.password = "Field should not be empty";	
  }	
  if (Object.keys(errors).length === 0) {	
    isLoading = true;	
    // Simulate network request	
    setTimeout(() => {	
      isLoading = false;	
      isSuccess = true;	
      // Authorize the user	
    }, 1000);	
  }	
};	
```

This modification makes the form go into success state as soon as the submission is complete.

But if you check your development server, you won’t find any changes in the form’s behavior. We changed the code but haven’t touched the template yet. We need to add instructions to the template to show a success message when a user has successfully logged in. Svelte’s template syntax allows us to implement that easily:

```html
<form on:submit|preventDefault={handleSubmit}>	
  {#if isSuccess}	
    <div class="success">	
      🔓	
      <br />	
      You've been successfully logged in.	
    </div>	
  {:else}	
    <h1>👤</h1>	

    <label>Email</label>	
    <input name="email" placeholder="name@example.com" bind:value={email} />	

    <label>Password</label>	
    <input name="password" type="password" bind:value={password} />	

    <button type="submit">	
      {#if isLoading}Logging in...{:else}Log in 🔒{/if}	
    </button>	

    {#if Object.keys(errors).length > 0}	
      <ul class="errors">	
        {#each Object.keys(errors) as field}	
          <li>{field}: {errors[field]}</li>	
        {/each}	
      </ul>	
    {/if}	
  {/if}	
</form>	
```

# Abstract with properties

We have sorted out everything about the internal component’s state. Now it’s time to go through the external dependencies called properties, or “props”. Props are inputs or arguments passed into the component to describe to the component what should appear or how the component should behave.

Declaration of a property looks similar to the state, except for the keyword `export`.

```html
<script>	
	export let answer;	
</script>	

<p>The answer is {answer}</p>	
```

```html
<script>	
	import Nested from './Nested.svelte';	
</script>	

<Nested answer={42}/>	
```

It’s all about the properties. Declare and pass — all you need to know to use props.

But how do these properties apply to the log-in form component? Props can make our log-in form more generic by extracting the submission function into a property. It will allow you to use this component with any submission action you need (request to a test server, request to an actual server, etc.). This prop will be called `submit` and will be a function which returns a resolved promise if the submit action has succeeded and a rejected promise if there is an error. Let's declare the prop by the example given above:

```js
export let submit;	
```

The submission handler inside the log-in form should also be edited to use the new `submit` property.

```js
const handleSubmit = () => {	
  errors = {};	
  if (email.length === 0) {	
    errors.email = "Field should not be empty";	
  }	
  if (password.length === 0) {	
    errors.password = "Field should not be empty";	
  }	
  if (Object.keys(errors).length === 0) {	
    isLoading = true;	
    submit({ email, password })	
      .then(() => {	
        isSuccess = true;	
        isLoading = false;	
      })	
      .catch(err => {	
        errors.server = err;	
        isLoading = false;	
      });	
  }	
};	
```

The component seems to be ready. However, if you return to the form and try to submit it, you’ll notice that the state of the button has not changed from loading. Also, there is an exception in the console: `Uncaught TypeError: submit is not a function`. Of course, we declared the prop but forgot to pass it. Let's declare a function in the app component and pass it to the log-in form.

```js
const submit = ({ email, password }) =>	
  new Promise((resolve, reject) => setTimeout(resolve, 1000));	
```

```jsx
<section>	
  <LoginForm submit={submit} />	
</section>	
```

Now the form is working as intended. It can both show errors and inform the user if the login has been successful.

<div align="center">	

<div style="width:60%">	

![](/media/1-e1h8xq_jpf0zyq1vs_syew.gif)

</div>	

</div>	

# Context sharing

It seems that everything necessary to build an application is listed. With the properties and the inner state, we’re ready to go. That’s only partially true, though. These two general points make it possible to design high-complexity SPAs. However, if you try sharing data among many different components, you’ll find it very difficult.

The simplest example is having a globally accessible `user` variable. A lot of components should change their behavior related to the user, depending on the user's role, age, status, etc. However, it isn't DRY to repeat ourselves by passing the user to each component in the app using props.

Svelte has a solution for this: the [context API](https://svelte.dev/tutorial/context-api).

> The context API provides a mechanism for components to 'talk' to each other without passing around data and functions as props, or dispatching lots of events. It's an advanced feature, but a useful one.

Let’s add the user context to the log-in form we’re designing. Create a file `userContext.js` inside the `src` folder with the following content:

```js
export const key = "userContext";	
export const initialValue = null;	
```

`key` is a unique identifier for the context as an application may have an unlimited number of different contexts which have to remain accessible. `initialValue` is just a default value for the context before it's set.

The next step is to add the context to our application. Navigate to the `App.svelte` file and add 2 import statements:

```js
import { onMount, setContext } from "svelte";	
import {	
  key as userContextKey,	
  initialValue as userContextInitialValue	
} from "./userContext";	
```

Looking at the code above you may wonder what we are importing from the `svelte` package. `onMount` is a helper function requiring a callback function as an argument. This callback will be executed when the current component is mounting (at the very start of loading the component). `setContext` is a setter function for a context. It requires the key to the context and a new value as its arguments.

Let’s use the `onMount` function to set the default value for the context:

```js
onMount(() => {	
  setContext(userContextKey, userContextInitialValue);	
});	
```

And modify the `submit` function to set the user context:	

```js
const submit = ({ email, password }) =>	
  new Promise((resolve, reject) => {	
    setTimeout(() => {	
      setContext(userContextKey, {	
        name: "Foo",	
        lastName: "Bar",	
        email: "foo@bar.com"	
      });	
      resolve();	
    }, 1000);	
  });	
```

That's it. Any successful submission will change the user context to a fake user object which can be accessed by a context getter `getContext`:	

```js
<script>	
import { getContext } from 'svelte';	
import { key as userContextKey } from "./userContext";	
const user = getContext(key);	
</script>	
```

# Summary

Svelte is a powerful tool capable of high performance and with a flexible API. Besides the basics covered in this post, Svelte has the following features out of the box:

* Reactive declarations and statements	
* Await template blocks	
* Dimensions binding	
* A global store like Redux	
* Animation and transition helpers	
* A debugging helper	

To sum up, Svelte is a great library that meets all the needs for building SPAs, and more. It can compete with the biggest players in the market, and even win. What it could use right now, though, is support in the [front-end developers’](https://www.toptal.com/front-end) community.


Notice: All the code from this article can be found on the `teimurjan/svelte-login-form` [GitHub repository](https://github.com/teimurjan/svelte-login-form). The demo for the log-in form is available [here](https://teimurjan.github.io/svelte-login-form).
