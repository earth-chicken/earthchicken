## Earth Chicken

### How to install this repository and execute it? Please follow the steps below. :)

1. Install __git__.   
Download from [Github official website](https://github.com).    
2. Install __node.js__ and __npm__.     
Download from [node.js official website](https://nodejs.org/en/).   
3. Open __Terminal__ and Go to the directory you want to put the folder.  
4. Clone the repository from the Github.
```
$ git clone git@github.com:earth-chicken/earthchicken.git
```
5. Go to earthchicken folder.
```
$ cd earthchicken
```
6. Install required libraries.
```
$ npm install
```
7. Run earthchicken server at __localhost:3000__ (default port is 3000). 
```
$ npm start
```
8. Visit the website.

Open the browser and type __localhost:3000__ .

---
### How to commit a new version and push to repository?

1. Open __Terminal__. 
2. Add your identity for git.
```
$ git config --global user.name "HERE_IS_YOUR_NAME"
$ git config --global user.email "HERE_IS_YOUR_EMAIL"
```
3. Check user information.
```
$ cat ~/.gitconfig
```
#### For example, I want to add a new function for this app with a script __new_function.js__ at ./service/

4. Make a branch __add_new_function__ for your function editing (only need to do once during this function editing.)
```
$ git branch a_new_function
```  
5. Change current working branch to __add_new_function__.
```
$ git chckout a_new_function
```
6. Add the change __./service/new_function.js__ for commit.
```
$ git add ./service/new_function.js
```
7. Commit the change and memo.
```
$ git commit -m 'Some parts of the new function.'
```
8. Push the new commit at branch __add_new_function__ to the Github __origin__ repository.  
```
$ git push origin a_new_function
```
9. Loop Step 5-8 to finish this function editing.  
#### Once finish the function you can merge it to __master__ branch.  
10. Change current working branch to __master__.
```
$ git checkout master
```
9. Pull add further change of branch __master__ at Github.
```
$ git pull
```
11. Merge finished branch __a_new_function__ to branch __master__.
```
$ git merge a_new_function
```
12. Push updated branch __master__ to Github.
```
$ git push origin master
```
#### Now you safely add a new function to the repository :)