## Getting started

1. Install [node.js](http://nodejs.org/) (make sure to choose the LTS version, i.e. v6.11.2 LTS)

1. Install [git](https://git-scm.com/)


1. Install the EditorConfig plugin for your IDE:
    * see [http://editorconfig.org/](http://editorconfig.org/) for details

1. Git configuration
	* Windows: set git core.autocrlf to false to avoid issues with EditorConfig (needed only once):
    	* `git config --global core.autocrlf false`

	* Git user information (if not done already)
    	* `git config --global user.name "John Doe"`
    	* `git config --global user.email "john.doe@wuert-it.com"`

1. Install grunt-cli, and eslint globally one by one or at once
    * One by one
        * `npm install -g grunt-cli`
        * `npm install -g eslint`
    * or together at once
        * `npm install -g grunt-cli bower eslint`

1. Install all npm and bower dependencies
    * `npm install`



1. Run grunt to lint, build, run the app or update the documentation:
    * `grunt` : linting + gerating JSDoc + run directly without build
    * `grunt lint` : linting
	* `grunt jsdoc` : update or create the documentation to the path ./doc

1. Open the app in your browser: [http://localhost:8080](http://localhost:8080)





## JSDoc

1. USE COMMENTS

	Make shure to comment your code in concideration of the sytax of JSDoc, so a documentation can be created.
	Link to JSDoc: [http://usejsdoc.org/index.html](usejsdoc.org).

1. UPDATE DOCUMENTATION

	- Automatically done with default grunt task

	- Command to manually update documentation:

		```
		grunt jsdoc
		```

1. USE THE DOCUMENTATION

	- the documentation can be found at localhost [http://localhost:8080](http://localhost:8080)
