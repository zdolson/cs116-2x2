import React from 'react'

import * as firebase from 'firebase'

export function initializeApp() {
	const config = {
	  apiKey: "AIzaSyAm2AxvW9dp_lAsP_hvgAUYnGWKGro8L00",
	  authDomain: "neo-market-8a303.firebaseapp.com",
	  databaseURL: "https://neo-market-8a303.firebaseio.com",
	  projectId: "neo-market-8a303",
	  storageBucket: "neo-market-8a303.appspot.com",
	  messagingSenderId: "1035941360979"
	};

	if (!firebase.apps.length) {
	    firebase.initializeApp(config);
	}
}

export function pullingDatabaseImage(id, imgUrl, imgLoad, tryAgain, that) {
	console.log('pullingDatabaseImage');
	if(tryAgain && !imgLoad){
		console.log('pullingDatabaseImage');
    var fireBaseDatabaseRef = firebase.database().ref('/ListingImages/');
    fireBaseDatabaseRef.on('value', function(snapshot) {
      var keys = Object.keys(snapshot.val())
      for(var i=0; i<keys.length;i++){
        if(id == keys[i]){
          var ref = firebase.storage().ref(snapshot.child(id).val());
          ref.getDownloadURL().then(url => {
            that.setState({ imgUrl: url, imgLoad: true, tryAgain: false });
          }).catch(err => {
            console.error(err)
            that.setState({tryAgain: true})
          });
        }
      }
    })
  }
}

function isInItemList(id, listOfItems) {
  for(var i = 0; i<listOfItems.length; i++) {
    if(id == listOfItems[i]['id']) {
      return true
    }
  }
  return false
}

export function pullMyPurchasesFromDatabase() {
	return new Promise((resolve, reject) => {
		let ref = firebase.database().ref('/Users/'+firebase.auth().currentUser.uid);
		ref.on('value', (snapshot) => {
			resolve(snapshot.child('myPurchases').val());
		});
	});
}

export function pullDataFromDatabase(that) {
  var arrayItemList = []
  var nonPurchasedList = []
  var currItem = {}

  return new Promise((resolve,reject) => {
    firebase.database().ref('/Listings/').once('value').then(function(snapshot) {
      snapshot.forEach((childSnapshot) => {
        if(!isInItemList(childSnapshot.child('id').val(), that.state.items)){
          currItem = {
            id: childSnapshot.child('id').val(),
            owner: childSnapshot.child('owner').val(),
            title: childSnapshot.child('title').val(),
            description: childSnapshot.child('description').val(),
            price: childSnapshot.child('price').val(),
            amount: childSnapshot.child('amount').val(),
            purchased: childSnapshot.child('purchased').val()
          }

          // Checks to add items to a nonPurchased item list
          if (childSnapshot.child('purchased').val() == false) {
            nonPurchasedList.push(currItem)
          }

          arrayItemList.push(currItem)
        }
      })
    }).catch(function(error) {
      console.log('An error occured while saving pulling listing data from firebase');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    });

    // First pass will usually be undefined so we have to account for it.
    if(typeof arrayItemList !== 'undefined') {
      that.setState({ items: arrayItemList})
      that.setState({ nonPurchasedItems: nonPurchasedList})
    }
    resolve(arrayItemList)
  })
}

export function postNewPostingToDatabase(id, owner, title, description, price, amount, imageFile, that) {
  return new Promise((resolve, reject) => {
    firebase.storage().ref().child(imageFile['name']).put(imageFile).then(function(snapshot) {
      console.log('Uploaded a blob or file!');

      // Adds new posting ID to databse storage -> 'ListingImages'
      firebase.database().ref('/ListingImages/' + id).set(
        imageFile['name']
      ).catch(function(error) {
        console.log('An error occured while adding the image name to the imageListing path in firebase');
        console.log(error.code);
        console.log(error.message);
        reject(error);
      });

      // Adds new posting to database storage -> 'Listings'
      firebase.database().ref('/Listings/' + id).set({
        id: id,
        owner: owner,
        title: title,
        description: description,
        price: price,
        amount: amount,
        imageName: imageFile['name'],
        purchased: false
      }).catch(function(error) {
        console.log('An error occured while saving the posting to listings in firebase');
        console.log(error.code);
        console.log(error.message);
        reject(error);
      });

      // Adds new listing to myListing field
      var currUserID = firebase.auth().currentUser.uid
      firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {
        if (snapshot.child('myListings').val() == '') {
          var myListingsList = id
        } else {

          // Taking the database field as a string and then splitting it to get an array to more easily parse through.
          // We do this because firebase doesnt support arrays in their database.
          var myListingsList = snapshot.child('myListings').val().split(',')
          myListingsList.push(id)
          myListingsList = myListingsList.toString();
        }
        firebase.database().ref('/Users/' + currUserID).update({
          'myListings': myListingsList
        }).catch(function(error) {
          console.log('An error occured while updating the myListings field');
          console.log(error.code);
          console.log(error.message);
          reject(error);
        })
      }).catch(function(error) {
        console.log('An error occured while adding to myListingField');
        console.log(error.code);
        console.log(error.message);
        reject(error);
      })
      resolve(id);
    }).catch(function(error) {
      console.log('An error occured while posting image to storage');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    });
  })
}

export function updateUserPhoto(file) {
	return new Promise((resolve, reject) => {
    firebase.storage().ref().child(firebase.auth().currentUser.uid).put(file).then(function(snapshot) {
			console.log('yolo');
			firebase.database().ref('/Users/'+firebase.auth().currentUser.uid).update({
				photoId: snapshot.downloadURL
			}).then(() => {
				resolve(snapshot.downloadURL);
			});
    }).catch(function(error) {
      console.log('An error occured while posting image to storage');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    });
  })
}

export function updateItemPhoto(file, id){
	return new Promise((resolve, reject) => {
		firebase.storage().ref().child(id).put(file).then(snapshot => {
			resolve(snapshot.downloadURL);
		}).catch(err => {
			console.log('An error occured while posting image to storage');
      console.log(err.code);
      console.log(err.message);
      reject(err);
		});
	});
}

export function postNewPostingToDatabaseDemo(id, owner, title, description, price, amount, imageFile, that) {
  return new Promise((resolve, reject) => {
    firebase.storage().ref().child(id).put(imageFile).then(function(snapshot) {
			resolve(snapshot.downloadURL);
    }).catch(function(error) {
      console.log('An error occured while posting image to storage');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    });
  })
}


export function editPostingToDatabase(id, description, title, price, imageFile, that) {
  var imageDatabaseRef = firebase.database().ref('/ListingImages/' + id);

  return imageDatabaseRef.once("value").then(function(snapshot) {
    var storageImageName = snapshot.val();
    var updateImageName = storageImageName;

    // If imageFile is not null, meaning that a file was imoprted
    if (imageFile != null) {

      // Once we know that there is an image file imported we can check the name of the file
      if (imageFile.name != storageImageName ) {
        updateImageName =  imageFile.name

        // Uploading your new image to firebase
        firebase.storage().ref().child(imageFile['name']).put(imageFile).then(function() {
        }).then(function() {
          // Removing old image and adding the new reference in
          imageDatabaseRef.remove().then(function() {
            imageDatabaseRef.set(imageFile.name);
          });
        }).catch(function(error) {
          // Handle Errors here.
          console.log('An error has occured while Updating your image in firebase storage')
          console.log(error.code)
          console.log(error.message)
        });
      }
    }

    // Adds new posting to database storage -> 'Listings'
    firebase.database().ref('/Listings/' + id).update({
      title: title,
      description: description,
      price: price,
      imageName: updateImageName
    }).catch(function(error) {
        // Handle Errors here.
        console.log('An error has occured while updating the listing in firebae')
        console.log(error.code)
        console.log(error.message)
    });
  }).catch(function(error) {
    // Handle Errors here.
    console.log('An error has occured while editting a post in firebase')
    console.log(error.code)
    console.log(error.message)
  });
}

export function pullUserData(that) {
	return new Promise((resolve, reject) => {
		let ref = firebase.database().ref('/Users/'+firebase.auth().currentUser.uid);
		ref.on('value', (snapshot) => {
			resolve(snapshot.val());
		}).catch((err) => {
			reject(err);
		});
	});
}

function uploadImage(img, uid) {
	return new Promise((resolve, reject) => {
		if(img == null) {
			resolve('defaultPhoto.png');
		} else {
			firebase.storage().ref().child(uid).put(img).then(function(snapshot) {
				resolve(snapshot.downloadURL);
			}).catch(err => {
				console.log('An error occured while posting image to storage');
	      console.log(error.code);
	      console.log(error.message);
	      reject(err);
			});
		}
	});
}

export function registerUserToDatabase(fullName, userName, email, photoId, password, verifyPassword, pubAdd, wif, that) {
	return new Promise((resolve,reject) => {
  	firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
			// console.log(user);
			uploadImage(photoId, user.uid).then((imgRef) => {
				console.log(imgRef);
				let newUser = {
	      	fullName: fullName,
	      	userName: userName,
	      	email: email,
	      	myListings: '',
	      	myPurchases: '',
	      	photoId: imgRef,
	      	password: password,
					publicAddress: pubAdd,
	      	wif: wif,
	        myCartItems: '',
	    	}
	    	firebase.database().ref('/Users/' + user.uid).set(newUser).then(() => {
					resolve(user.uid);
				}).catch((err) => {
					// Handle Errors here.
	    		console.log('An error has occured while registering the user via Firebase: ')
	      	console.log(error.code)
	      	console.log(error.message)
	        that.setState({
	          registerError: true,
	          registerErrorMessage: error.message
	        })
					reject(error);
				});
			}).catch(err => {
				console.log('An error has occured while uploading your image via Firebase: ')
				console.log(err.code)
				console.log(err.message)
				that.setState({
					registerError: true,
					registerErrorMessage: error.message
				})
				reject(error);
			})

    }).catch(function(error) {
        // Handle Errors here.
    		console.log('An error has occured while registering the user via Firebase: ')
      	console.log(error.code)
      	console.log(error.message)
        that.setState({
          registerError: true,
          registerErrorMessage: error.message
        })
		reject(error);
    });
	})
}

export function deletePosting(id, that) {
  return new Promise((resolve,reject) => {
    // Removing post from listing database
    firebase.database().ref('/Listings/' + id).remove().then(function() {

      // Removing reference image
      firebase.database().ref('/ListingImages/' + id).remove()

      // Removing listing ID from myListings user field
      var currUserID = firebase.auth().currentUser.uid
      firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {

        // Make into array to more easily parse through
        var myListingsList = snapshot.child('myListings').val().split(',');
        if(myListingsList.length == 1) {
          // If delelting last myListing, then set database value back to blank value('')
          myListingsList = ''
        } else {
          var index = myListingsList.indexOf(id)
          if(index != -1){
            myListingsList.splice(index, 1)
            myListingsList = myListingsList.toString()
          }
        }
        firebase.database().ref('/Users/' + currUserID).update({
          'myListings': myListingsList
        }).catch(function(error) {
          console.log('An error occured while updating the myListings field');
          console.log(error.code);
          console.log(error.message);
          reject(error);
        })
        resolve(snapshot.child('myListings').val())
      }).catch(function(error) {
        console.log('An error occured while adding remvoing the myListings');
        console.log(error.code);
        console.log(error.message);
        reject(error);
      })

    }).catch(function(error) {
      // Handle Errors here.
      console.log('An error has occured while removing a listing: ')
      console.log(error.code)
      console.log(error.message)
    })
  })
}

export function getMyListings(that) {
  return new Promise((resolve,reject) => {
    var currUserID = firebase.auth().currentUser.uid
    firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {
      if (snapshot.child('myListings').val() == '') {
        that.setState({myListings: []})
      } else {
        that.setState({myListings: (snapshot.child('myListings').val()).split(',')})
      }
      resolve(snapshot.child('myListings').val());
    }).catch(function(error) {
      console.log('An error occured while pulling myListings from firebase');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    })
  })
}

export function addCartItemToDatabaseField(id, that) {
  return new Promise((resolve,reject) => {
    var currUserID = firebase.auth().currentUser.uid
    firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {
			var was_added;
      if (snapshot.child('myCartItems').val() == '') {
				was_added = true;
        var cartItemList = id
      } else {
        var cartItemList = snapshot.child('myCartItems').val().split(',')
				if(cartItemList.includes(id)){
					was_added = false;
				}else{
					was_added = true;
					cartItemList.push(id);
				}
        cartItemList = cartItemList.toString();
      }
      firebase.database().ref('/Users/' + currUserID).update({
        'myCartItems': cartItemList
      }).then(() => {
				resolve(was_added);
			}).catch(function(error) {
        console.log('An error occured while updating the cartItems field');
        console.log(error.code);
        console.log(error.message);
        reject(error);
      })
    }).catch(function(error) {
      console.log('An error occured while adding cartitems to firebase');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    })
  })
}

export function removeCartItemFromDatabase(id, that) {
  return new Promise((resolve,reject) => {
    var currUserID = firebase.auth().currentUser.uid
    firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {
      var cartItemList = snapshot.child('myCartItems').val().split(',');
      if(cartItemList.length == 1) {
        cartItemList = ''
      } else {
        var index = cartItemList.indexOf(id)
        if(index != -1){
          cartItemList.splice(index, 1)
          cartItemList = cartItemList.toString()
        }
      }
      firebase.database().ref('/Users/' + currUserID).update({
        'myCartItems': cartItemList
      }).catch(function(error) {
        console.log('An error occured while updating the cartItems field');
        console.log(error.code);
        console.log(error.message);
        reject(error);
      })
      resolve(snapshot.child('myCartItems').val())
    }).catch(function(error) {
      console.log('An error occured while adding remvoing the cartItem');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    })
  })
}

export function getCartItemsFromDatabase(that, items) {
	// console.log('getCartItemsFromDatabase');
	// console.log(items);
  return new Promise((resolve,reject) => {
    var currUserID = firebase.auth().currentUser.uid
    firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {
      // console.log(snapshot.child('myCartItems').val())
      if (snapshot.child('myCartItems').val() == '') {
        that.setState({cartItems: []})
      } else {
        var listOfCartItems = (snapshot.child('myCartItems').val()).split(',')
        var removeIndexes = []
        var listingItems = items
        var foundItem = false

        // Loop through the cartItems
        for(var i=0; i<listOfCartItems.length;i++) {

          // Loop to check if current CartItem is in the itemList
          for(var k = 0; k<listingItems.length; k++) {

            // If the cartItem is in the item list then go here
            if(listOfCartItems[i] == listingItems[k]['id']) {
              foundItem = true

              // Check purchase Flag, if its true, then the item has been purchased
              console.log(listingItems[k]["isPurchased"])
              if (listingItems[k]["isPurchased"]) {
                console.log('The item has been purchased, adding it to removeIndexes')
                removeIndexes.push(i)
              }
            }
          }

          // Item was not found in the list of Items, therefore remove the cartItem
          if(!foundItem) {
            console.log('Item was not found, so removing it from indexes')
            removeIndexes.push(i)
          }
          // resets the value afterwards for next check
          foundItem = false

          console.log(removeIndexes)
          if (removeIndexes.length > 0) {
            // Do a reverse for loop to splice indexes in order to preserve indexes after each splice
            for(var i = removeIndexes.length-1;i>=0;i--) {
              listOfCartItems.splice(removeIndexes[i], 1)
            }
          }

          // Update firebase with new cartItem list
          firebase.database().ref('/Users/' + currUserID).update({
            'myCartItems': listOfCartItems.toString()
          }).catch(function(error) {
            console.log('An error occured while updating the cartItems field inside getCartItems');
            console.log(error.code);
            console.log(error.message);
            reject(error);
          })
          console.log(listOfCartItems)
          that.setState({cartItems: listOfCartItems})
        }
      }
      resolve(snapshot.child('myCartItems').val());
    }).catch(function(error) {
      console.log('An error occured while pulling cartItems from firebase');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    })
  })
}

export function getMyPurchasesFromDatabase(that) {
  return new Promise((resolve,reject) => {
    var currUserID = firebase.auth().currentUser.uid
    firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {
      if (snapshot.child('myPurchases').val() == '') {
        that.setState({myPurchases: []})
      } else {
        that.setState({myPurchases: (snapshot.child('myPurchases').val()).split(',')})
      }
      resolve(snapshot.child('myPurchases').val());
    }).catch(function(error) {
      console.log('An error occured while pulling myPurchases from firebase');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    })
  })
}

export function makePurchase(cartItems, that) {
  return new Promise((resolve,reject) => {
    var currUserID = firebase.auth().currentUser.uid
    firebase.database().ref('/Users/' + currUserID).once('value').then((snapshot) => {

      // Getting the myPurchases field from firebase and adding the new cartItems to the user's current myPurchasesTab
      if (snapshot.child('myPurchases').val() == '') {
        var currPurchList = cartItems
      } else {
        var currPurchList = snapshot.child('myPurchases').val().split(',');
        currPurchList = currPurchList.concat(cartItems)
      }
      currPurchList = currPurchList.toString()

      // Updating User's myPurchases field to hold what the user just purchased.
      firebase.database().ref('/Users/' + currUserID).update({
        'myPurchases': currPurchList
      }).then(function() {
        // Setting User's cartItems to '' since they just purhcased their items
        firebase.database().ref('/Users/' + currUserID).update({
          'myCartItems': ''
        }).then(function() {
          resolve(snapshot.child('myPurchases').val());
        }).catch(function(error) {
          console.log('An error occured while updating the cartItems field');
          console.log(error.code);
          console.log(error.message);
          reject(error);
        })
      }).catch(function(error) {
        console.log('An error occured while updating the cartItems field');
        console.log(error.code);
        console.log(error.message);
        reject(error);
      })

    }).catch(function(error) {
      console.log('An error occured while pulling myPurchases from firebase');
      console.log(error.code);
      console.log(error.message);
      reject(error);
    })
  })

}

export function loginUser(email, password, that) {
  return firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
    console.log('User: ' + email + ' has been sucessfully logged in')
    return user
  }).catch(function(error) {
    // Handle Errors here.
    console.log('An error has occured while logging in the user via Firebase: ')
    console.log(error.code)
    console.log(error.message)
    that.setState({
      loginErrorMessage: error.message,
      loginError: true
    })
  });
}

export function logoutUser(){
  firebase.auth().signOut().then(function() {
    console.log('User was logged out successfullly')
  }).catch(function(error) {
    console.log('An error has occured while logging out the user via Firebase: ')
    console.log(error.code)
    console.log(error.message)
  });
}
