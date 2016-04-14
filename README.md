# Bastli LANstack
LANstack by Bastli is an *interactive seat map and floor plan web application for LAN parties*. It tries to become a full fledged platform in the long run.

![Alt text](/public/lanstack-screenshot.PNG?raw=true "Screenshot of LANstack webinterface.")

## Setup
1. Install Meteor (https://www.meteor.com/install). 
2. Clone the repository with <kbd>git clone https://github.com/Atokulus/LANstack.git</kbd>
3. <kbd>cd ./LANstack</kbd>
4. Execute <kbd>meteor run</kbd> or <kbd>sudo meteor run --port 80</kbd>. This will install all the required Meteor packages.
5. Ensure your firewall is properly setup and open the webapplication in your browser (Google Chrome is supported for now) under 
`http://localhost:3000` or `http://localhost`.

### Customization
The floorplan can be modified in the JSON blob on top of the file `./client/seatmap.js`. An example is given below with all sizes in meters. The background image is stored under `./public/map_background.png`.

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
Copyright (c) 2016 Markus Wegmann (@Atokulus) & Dan Mugioiu (@Killler07). Commercial use not allowed. Attribution by mention of this project.
