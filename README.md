# Bastli LANstack
LANstack by Bastli is an interactive seat map and floor plan webapplication for LAN partys. It tries to become a full fledged platform for our next LAN parties.

![Alt text](/public/lanstack-screenshot.png?raw=true "Screenshot of LANstack webinterface.")

## Setup
Install Meteor (https://www.meteor.com/install). Clone the repository, <kbd>cd ./LANstack</kbd> into project, and execute 
<kbd>meteor run</kbd> or <kbd>sudo meteor run --port 80</kbd>. This will install all the required Meteor packages.
Ensure you firewall is properly setup and open the webapplication in your browser (Google Chrome is supported for now) under 
`http://localhost:3000` or `http://localhost`.

The floorplan can be modified in the JSON blob on top of the file `./client/seatmap.js`. All the sizes are given in meters.
The background is under `public/map_background.png`.

To reset the whole database just run <kbd>meteor reset</kbd> in the project folder. 

```javascript
sitzplan = {
    rotation: 180, // overall rotation
    background: {
        url: 'hintergrund.svg',
        position: [-1.7, 0],
        size: [21.7727273, 41.9545454545],
        rotation: 180
    },
    tables: [
        {
            name: 'A',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [4, 12.5],
            size: [3.6, 0.9],
            seats: 10
        },
        {
            name: 'B',
            number: 1,
            shape: 'double_row_half',
            rotation: 0,
            position: [4, 16.5],
            size: [3.6, 0.9],
            seats: 10
        }
    ]
}
```

## Usage
All data is synced between all clients, meaning you do not have to refresh the website everytime. 
The map has pan & zoom controls. The seats can be selected in the list and on the map by a click. 
Search results will be highlighted on the map as well.

## Contribution
If you have specific ideas and would like to contribute to this project please get in touch with me. 
You may modify and integrate the source code into other non-commercial AND private projects, and doing 
a pull request is very much appreciated.

The CSS Framework used is Semantic UI, the map is drawn in Snap.svg, and all the templating is done for now in Meteor Blaze.

## License
Copyright (c) 2016 Markus Wegmann (atokulus). Commercial use not allowed. Attribution by mention of this project.
