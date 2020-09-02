# version
v1.0

# pixelizer
Small script to create a pixel animation based on an image. Script will draw image on canvas, create pixels out of image and then animate those pixels to render the image at the end. 

This script is based on the work of Louis Hoebregts @Mamboleoo on codepen: https://codepen.io/Mamboleoo/pen/obWGYr. I took his algorithm, put it into a class and customized it with different options.

# demo

try out on <a href="https://mevimedia.de/pixelizer" target="_blank">https://mevimedia.de/pixelizer</a>

# implementation
- add script as module to your html file.
- import Pixelizer 

# usage
create new Instance with data-object: 
     
     let pixelizer = new Pixelizer({data})

# data
    data = {
    
          canvas: '#canvas', -> mandatory: DOM-Selector for canvas element

          src: './image.svg', -> mandatory: Source for image file. can be svg, png, jpeg.

          options: { -> optional parameters:

              pixelRadius = 5, // size of pixels

              amount = 150, // amount of pixel

              threshhold = 150, //range: 1-254, threshhold for pixel values from original img

              colors = ["#FFFFFF"], // array with colors for random colorization of pixels

              verticalDistribution = 5, // how far pixels fly around vertically

              horizontalDistribution = 5, // how far pixels fly around horizontally

              friction = false, // if friction is true, pixels will not head straight to destination. if true, speed is ignored

              frictionValue = 1, // range: 1-10, define variation of 

              autoinit = true // wether animation starts on instance creation. if set to false, init animation with pixelizer.init()

              speed = 100 // 1-1000: how fast pixels will get to destination
          }
     }
