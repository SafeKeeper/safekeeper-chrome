SafeKeeper - Protecting Web Passwords using Trusted Execution Environments
==========================================================================

Introduction
------------

SafeKeeper is a server-side technology for protecting password databases. SafeKeeper's server-side password protection service is a drop-in replacement for standard password hashing functions. It computes a cipher-based message authentication code (CMAC) on passwords before they are stored in the
database. An adversary must obtain the CMAC key in order to perform offline guessing attacks against a stolen password database. SafeKeeper generates and protects this key within a Trusted Execution Environment, realized using Intel's Software Guard Extensions (SGX) technology.

This repository contains the SafeKeeper client-side extension for Google Chrome.


Installation
------------

To install the extension, open the URL "chrome://extensions" in the Chrome browser. 
Click "Developer mode" to enable it, then click "Load unpacked extension...".
Select the directory containing manifest.json file (should be the top level 
directory of this repository). If successfully installed, the SafeKeeper icon will 
appear to the right of the address bar.


Licenses
--------

This extension is licensed under the Apache 2.0 license, and it includes dependencies with various other licenses. The individual dependency licenses are provided in the corresponding folders. 
The original dependency repositories and source are:

  * [jsbn](http://www-cs-students.stanford.edu/%7Etjw/jsbn/)
  * [sjcl](https://github.com/bitwiseshiftleft/sjcl)
  * [jsrsasign](https://github.com/kjur/jsrsasign)
  * [aes-js](https://github.com/ricmoo/aes-js)
  * [jquery](https://github.com/jquery/jquery)
