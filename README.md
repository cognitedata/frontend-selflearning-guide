# Frontend self-learning guide
Simple single page application (SPA) for exploring events which belong to selected asset, adding new events to it.

## Purpose
Providing step by step explanation of frontend application creation process.

## Expected result
Frontend application, which has: 
* authentication handled by `@cognite/sdk`
* asset search capabilities
* list of events that belong to selected asset
* creating assets capabilities

## Background
Pretty basic knowledge of `HTML` and `JavaScript`

## Tech, that gonna be used
During development few libraries are going to be used to avoid very specific frontend tasks:
* React JS Library – to create SPA in simple way
* Cognite JavaScript SDK – to handle all API calls to CDF
* Cognite Gearbox – UI components library to display data coming from CDF  

## First step
All steps, including this one, are referring to the libraries documentation. It's a nice idea to keep them open in your browser:
* [React](https://reactjs.org/docs/introducing-jsx.html)
* [Cognite JavaScript SDK](https://github.com/cognitedata/cognite-sdk-js#cognite-javascript-sdk) and [Docs](https://cognitedata.github.io/cognite-sdk-js/)
* [Cognite Gearbox](https://github.com/cognitedata/gearbox.js#gearboxjs) and [Examples](https://cognitedata.github.io/gearbox.js/?path=/docs/assets-assetbreadcrumb--basic-usage)
* [Ant Design Library](https://ant.design/components/form/)

### Setup an environment
Because of wide community, bootstrap React application its super easy thing to accomplish. So, you need:
1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/) installed.
2. From terminal, make new project using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)
    ```shell script
    npx create-react-app spa-app
    ```
3. Navigate to just created folder and remove all files inside `/src` folder. They will be replaced very soon.
    ```shell script
    cd spa-app/src
    rm -f *
    ```

### Add needed dependencies
Now its time to add dependencies that are required for application:
```shell script
# Cognite Javascript SDK
npm install @cognite/sdk --save
# Cognite Geabox
npm install @cognite/gearbox --save
# few packages that are required by Gearbox, including antd
npm install @cognite/griff-react@~0.4.2 antd styled-components --save
```
 
### Preparing template to start with
So, you need to create 3 files inside the `/src` folder:
* `index.js` – root file of our application.
It's actually the place where SPA application connects to the browser DOM.
Put code below right inside it:
```jsx harmony
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './styles.css';
import { App } from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```
* `styles.css` – file, where all css styles are placed. It's pretty shallow. Jsut put following code inside it.
```css
.header, .body, .actions {
  padding: 10px 50px;
}
.header {
  border-bottom: 1px solid #dedede;
  display: flex;
}
form {
  margin-bottom: 10px;
}
label, button {
  margin: 0 10px;
}
input, button {
  border: 1px solid #dedede;
}
button {
  white-space: nowrap;
}
```
* `App.js` – main component of application. It will handle auth process as well. And yes, you know what to do.
```jsx harmony
import React, { useState, useEffect } from 'react';

const auth = () => {};

export const App = () => {
  const [client, setClient] = useState();

  useEffect(() => {
    auth(setClient);
  }, []);

  return (
    <>
      <p>We are ready!</p>
    </>
  );
};
```

### First run
And finally application ready to be alive.
Go to `package.json` file and change configuration for start script:
**For MacOS/Linux (Bash)**
```json
{
  "start": "HTTPS=true react-scripts start"
}
```
**For Windows (cmd.exe)**
```json
{
  "start": "set HTTPS=true&&npm start"
}
```
After all, you'll able to run local dev server from terminal:
```shell script
npm start
```
After few seconds you'll be redirected to `https://localhost:3000` and see the phrase that has been added before – `We are ready!`.
If you see it – congrats, you're ready to start developing. Otherwise, you need review previous steps to make it work.

## Add authentication
Cognite SDK can be used to deal with authentication via OAuth. So, in `App.js` file you need to: 
* create instance of `CogniteClient` which can be imported from `@cognite/sdk`
```javascript
const sdk = new CogniteClient(/* ... */);
const auth = () => {};
```
* use `loginWithOAuth` and `authenticate` methods to authenticate inside `auth()` method
```javascript
const auth = async (setClient) => {
    sdk.loginWithOAuth(/* ... */);
    await sdk.authenticate();
};
```
* pass client instance inside the component
```javascript
const auth = async (setClient) => {
    // ...
    await sdk.authenticate();
    
    setClient(sdk);
};
```
* to check if you're authenticated or not, change component template a bit to reflect changes
```jsx harmony
export const App = () => {
  // ...
  
  return (
    <>
      {
        !client 
          ? <p>You have to authenticate first</p>
          : <p>Congrats! You're ready to do stuff!</p>
      }
    </>
  );
};
```

After success authentication via third part auth service you'll be redirected back to local host and should recognise changes on the page.

## First own created component
So it's time to add gearbox components into application. This process need to be split into few phases:
* provide gearbox components with sdk instances
* add few components to application  

### Connect sdk instance to gearbox components
It's super easy to provide SDK for Gearbox components cause you can use `ClientSDKProvider` for this purposes. `ClientSDKProvider` is a context provider for all Gearbox components that lays down in component hierarchy.
So, in `App.js` you should wrap whole template with `ClientSDKProvider` component and provide sdk instance as a `client` property for `ClientSDKProvider`.

### Do stuff
Gearbox component can be added now. For this purposes new component need to be created:
* create new file `Content.js` and add code below
```jsx harmony
import React, {useState} from 'react';

export const Content = ({client}) => {
  const [asset, setAsset] = useState();
  const [updating, setUpdating] = useState(false);
  const onLiveSearchSelect = (selectedAsset) => {
    setAsset(selectedAsset);
  };

  return (
    <>
      <div className="header">
        {/** AssetSearch **/}
      </div>
      <div className="body">
        {
          asset && !updating
            ? (
                <>
                  {/** AssetEventsPanel **/}
                </>
              )
            : <p>No asset selected</p>
        }
      </div>
    </>
  )
};
```
* add `AssetSearch` and `AssetEventsPanel` components from gearbox and path required properties to them
* import this component inside `App.js` component and pass `client` instance of SDK as a property
* try to make search for an asset in the search bar and select some asset to display events that belong to it

## Add Events
Now application acts pretty good, the one thing left – ability to add event to the selected asset.
To implement this functionality few things are missed:
* Add event form
* Refresh button which forces events table to render

Create file *EventForm.js*. It should contain add event form logic inside, it could be something like:
```jsx harmony
import React, { useState } from 'react';

export const EventForm = ({ client, assetId }) => {
 const [type, setType] = useState('');
 const [description, setDescription] = useState('');
 const onSubmit = async e => {};

 return (
   <form onSubmit={onSubmit}>
     This is where you build your form
   </form>
 );
};
```
You should just complete form with *type* and *description* input fields.

`onSubmit` handler should create new event with *type* and *description* from input fields, *startTime* equals current timestamp
and clean up input fields after adding event.

And of course, you should add *EventForm* component somewhere inside *Content* component.  

## Render results
After adding new event nothing changed in the table, right? That's because you need to get updated results from the CDF.

You can do this by re-fetching data inside *Content* component. To trigger such action you should call handler below.
```js
const refreshEventsTable = async () => {
   await setUpdating(true);
   await setUpdating(false);
};
``` 

It should be onclick handler of refresh button. So, add button to the header of application inside *Content* component with `refreshEventsTable` handler.
