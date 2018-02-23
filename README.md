# reactEmbed

An node project using webpack and babel to convert a react component to a js file that can be consumed by non-react websites.

### Usage

1. Clone the repo
2. Run ```npm install```
3. Run ```npm run bundle-js```
4. Edit the hashtag you want to follow. This is the first parameter in the ```OceanWiseUGC()``` function
5. Edit the ```globalStyle```, ```lgMax```, and ```xsMax``` variables in the ```initialise()``` call within ```index.html```. ```lgMax``` adds styles when window width < 1730; ```xsMax``` adds styles when window width < 768.
6. Run the example  ```npm run example```

Step 3 will generate two files in the build folder. A chat-template.js and chat-template-min.js.

See [index.html](https://github.com/edinnen/reactEmbed/blob/master/index.html) for an example how these files are consumed. The minified build of this project as of 01/30/2018 is accessible at http://35.227.59.7:443/embeddable for embedding on external pages.

### Adapting for a different component

1. Replace references to chat-template and change the method name in wrapper.js
2. Update method name and the output file names in the two webpack config files.
3. Update index.html
3. Run the usage steps.
