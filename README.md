This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


overall goals:

1) finish a ML project of some sort, write some blog posts about it

2) tackle "handwriting" which is above the current computer vision buzzwords

3) send people handwritten emails. because I'm a hipster or something



what I want to do withis:

make this into a front end for examining handwriting

import sample images -> lambda convert to dots store in db

lambda to fit bezier curves to those dots

add text string, and map it to the output (ie, which region is which letter(s))


---> at this point I'll have a training set for 1) reading, 2) writing


reading:

convert input image into groups (words ish) of bezier curve fittings

guess & train given input curves -> text


writing:

given an input text (word or words)

guess and train 1) against training set, 2) that the reader can read the output



then it could be turned into an app for scanning handwritten drawings and sending them around in a somewhat searchable format

for a design / wireframe / brainstorming type thing


the benefit of using cubic beziers for everything is that the output is easily and quickly rendered into webview <svg> elements


the end of line value is a format for describing handwritten fonts



tasks:

calculate ratio on svg root element resize, for x AND y

allow the user to zoom in and out the svg viewBox (deal with ratios)

select curve from control panel, select none / multiple


tool for "new curve smoothly" a la svg S command

export



also draw a bunch of dots when imported


convert images of my handwriting into a series of dots