#### FredTV - Simple Node media server
It will filter and display all videos of assigned folders.
You can play supported and unsupported files right away. 
The ffmpeg lib will encode videos on the fly and stream back through http request.

##### Screenshots
![folder tree](https://github.com/g45t345rt/fredtv/blob/master/readme_images/folder_tree_300.jpg?raw=true)
![video player](https://github.com/g45t345rt/fredtv/blob/master/readme_images/player_300.jpg?raw=true)

##### Features
- Expandable file tree viewer 
- Custom video player that works with unsupported videos
- Access file metadata
- Chromecast support

##### Assigned folders with config.json
  ![config file](https://github.com/g45t345rt/fredtv/blob/master/readme_images/config.jpg?raw=true)

##### Development
Clone repository

Open 1st terminal
`npm run dev-client` -> Watch and bundle clien side code with webpack

Open 2nd terminal
`npm run dev-server` -> Run server with nodemon

##### Build production & release
TODO
