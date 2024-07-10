# Bacterium

Bacterium is a cellular automata simulation of simple bacterial growth.

This app is built using React and Typescript, using HTML Canvas for the simulation logic and rendering.

## Features
- Supports real-time cell drawing/deletion
- Option to play, pause, and step through simulation
- Variable cell growth rate
- Ability to automatically scale grid to browser width

## Setup Locally
### From the project directory, run:
- `npm install` to install dependencies
- `npm run dev` to run development build
### To run production-ready build:
- `npm install` to install dependencies
- `npm run build` to build
- `npm run preview` to run the build

## Project Structure
The main logic of the app is contained in the Canvas component.

This defines the actual HTML canvas element that renders the simulation.

The canvas use flags set by the Controls component as properties of the simulation.

## Assumptions
The simulation runs on the following immutable assumptions:
- Once alive, a bacteria cell does not die.
- A bacteria cell cannot move.
  
To expand on the second point, this means that the growth of the simulation is not exponential as bacteria cells will have no room to grow.

## Performance
The simulation is CPU-bound and does not include any parallelization.

To prevent performance issues, a hard cap of cell size of 5 and growth rate of 30 generations per second is set. 

From testing, setting each cell to pixel size is far too computationally demanding for a sequential algorithm.

