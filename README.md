##Instructions

* clone the repo
* npm install
* gulp watch
* navigate to http://localhost:4034/dist/

###Deploying to github pages

1. Build your distributuion: `gulp build`
1. Make sure you've committed the built files: `git add dist && git commit -m 'build'`
1. Deploy using `git subtree push`: `git subtree push --prefix dist origin master`
  _NOTE: this assumes your remote is called `origin` and is the liminalsoftware.github.io repo at github (git@github.com:LiminalSoftware/liminalsoftware.github.io.git)_

  You'll see output similar to this:

  ```
  [13:43:09] Using gulpfile ~/Projects/liminal/landing/gulpfile.js
  [13:43:09] Starting 'deploy'...
  [13:43:09] Finished 'deploy' after 4.01 ms
  stdout: git push using:  origin master

  stderr: -n 1/       4 (0)
  -n 2/       4 (1)
  -n 3/       4 (2)
  -n 4/       4 (3)
  To git@github.com:LiminalSoftware/liminalsoftware.github.io.git
     3558658..8231ed8  8231ed8b0e6cc72171c0367f41f79780e4906697 -> master
  ```
