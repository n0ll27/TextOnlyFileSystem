# TextOnlyFileSystem
A simple yet useful text-command and file-based application that utilizes the Node.js File System module's APIs to simplify tedious manual file related tasks. 

Primitive Commands:
  1. create file
  2. delete file
  3. rename file <file_path> -new name <new_file_path>
  4. add <file_path> -data <data>
  
  *  Use the command.txt file to execute these commands.
  *  There are no barriers preventing you from deleting the command.txt file. If you do, create a new file MANUALLY with the same name.
  *  Depending on your operating system Node.js' inefficient watcher module may output multiple messages of the same content to console. 
  *  The IIFE isn't exportable therefore I was unable to turn this into a seperate Node.js module. 

