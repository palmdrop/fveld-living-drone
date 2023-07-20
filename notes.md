# Resources
component library - https://articles.wesionary.team/react-component-library-with-vite-and-deploy-in-npm-579c2880d6ff

# Todo
- [ ] Adapt colors based on...
  - [X] Noise value
  - [ ]? Movement direction
  - [ ]? Actual thickness
  - [ ]? Attractor proximity

- [X] add randomization to colors

- [ ] animate underlying noise slightly to adapt thickness and color for each layer?

- [X] add support for gradients with more than two colors

- [ ] experiment with hyper-thin, windling lines, soft blobs, watercolor styles, etdc
  * shadow spots experiments
  * thin lines
  * random specks, etc

- [ ] Add detail
  - [ ] Lighter color details
  - [ ] Randomized rendering (noise, specks, lines)

- [ ] figure out how to handle window resize
  * and how to handle reize in the middle of graph growth?
  * options:
    * clear and keep going
    * reset
    * re-render everything
    * resize current render

- [ ] optimize
  - [ ] minimize draw calls
  - [ ] reduce complexity for mobile devices

- [ ] ensure interactivity on mobile devices

- [ ] scale properly for different screen sizes
  * should sketch have the same level of detail regardless of screen size?
  * or should it scale, i.e less complexity for smaller screens?

- [X] if growth doesn't make progress or tries to spawn too many new branches without growing in the right direction, terminate
  * this may happen if user sets gravity to be contrary to the desired growth direction
  * one way of stopping it is to kill the growth if it does not consume leaves fast enough
  * FIX: Just make sure max number of steps is set low enough.