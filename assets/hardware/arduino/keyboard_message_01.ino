/*
  Keyboard Message test

  For the Arduino Leonardo and Micro.

  Sends a text string when a button is pressed.

  The circuit:
  - pushbutton attached from pin 4 to +5V
  - 10 kilohm resistor attached from pin 4 to ground

  created 24 Oct 2011
  modified 27 Mar 2012
  by Tom Igoe
  modified 11 Nov 2013
  by Scott Fitzgerald

  This example code is in the public domain.

  https://www.arduino.cc/en/Tutorial/BuiltInExamples/KeyboardMessage
*/

#include "Keyboard.h"

const int buttonPin = 4;         // input pin for pushbutton
int previousButtonState = HIGH;  // for checking the state of a pushButton
int counter = 0;                 // button push counter

void setup() {
  // make the pushButton pin an input:
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(A2, OUTPUT);
  for(int i = 0; i<3; i++){

  pinMode(6 + i, OUTPUT);
  }
  digitalWrite(A2, LOW);
  // initialize control over the keyboard:
  Keyboard.begin();
}

int offset = 0;
int start = 0;

void loop() {
  // read the pushbutton:
  int buttonState = digitalRead(buttonPin);
  if(buttonState == HIGH) start = millis();
  int held = millis() - start;
  // if the button state has changed,
  if ((buttonState != previousButtonState) && (buttonState == LOW)) {
    Keyboard.print("S");
    digitalWrite(6 + offset, HIGH);
  }
  if ((buttonState != previousButtonState) && (buttonState == HIGH)) {
    Keyboard.print("U");
    digitalWrite(6 + offset, LOW);
    offset++;
    offset %= 3;
  }

  if(held < 10){
    digitalWrite(6, HIGH);
    digitalWrite(7, HIGH);
    digitalWrite(8, HIGH);
  }else if(held < 5000){
    digitalWrite(6, HIGH);
    digitalWrite(7, LOW);
    digitalWrite(8, LOW);
  }else {
    digitalWrite(6, LOW);
    digitalWrite(7, HIGH);
    digitalWrite(8, LOW);
  }
  // save the current button state for comparison next time:
  previousButtonState = buttonState;
  delay(100);
}
