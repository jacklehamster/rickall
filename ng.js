const ngio = new Newgrounds.io.core("48865:gb0HnhPm", "dcw+YvVcEow+KOTL54towA==");


function onLoggedIn() {
    console.log("Welcome " + ngio.user.name + "!");
	// const button = document.body.appendChild(document.createElement('button'));
	// button.classList.add('button');
	// button.innerText = "lock medals";
	// button.addEventListener('click', e => {
	// 	fetchMedals(ngio, medals => {
	// 		medals.forEach(medal => medal.unlocked = false);
	// 		console.log(medals);
	// 	})
	// });
	Engine.onTrigger(action => {
        if(action.medal) {
            unlockMedal(ngio, action.medal, medal => console.log(medal.name, 'unlocked'));
        } else if(action.score && action.value) {
            postScore(ngio, action.score, action.value, result => console.log(result));
        }
	});
	fetchMedals(ngio, () => {});
    fetchScoreBoards(ngio, () => {});
}

function onLoginFailed() {
    console.log("There was a problem logging in: " . ngio.login_error.message );
}

function onLoginCancelled() {
    console.log("The user cancelled the login.");
}

/*
 * Before we do anything, we need to get a valid Passport session.  If the player
 * has previously logged in and selected 'remember me', we may have a valid session
 * already saved locally.
 */
function initSession() {
    ngio.getValidSession(function() {
        if (ngio.user) {
            onLoggedIn();
        } else {
             const button = document.body.appendChild(document.createElement('button'));
             button.classList.add('button');
             button.innerText = "login";
             button.addEventListener('click', e => {
             	requestLogin();
             });
        }

    });
}

/* 
 * Call this when the user clicks a 'sign in' button from your game.  It MUST be called from
 * a mouse-click event or pop-up blockers will prevent the Newgrounds Passport page from loading.
 */
function requestLogin() {
    ngio.requestLogin(onLoggedIn, onLoginFailed, onLoginCancelled);
    /* you should also draw a 'cancel login' buton here */
}

/*
 * Call this when the user clicks a 'cancel login' button from your game.
 */
function cancelLogin() {
    /*
     * This cancels the login request made in the previous function. 
     * This will also trigger your onLoginCancelled callback.
     */
    ngio.cancelLoginRequest();
}

/*
 * If your user is logged in, you should also draw a 'sign out' button for them
 * and have it call this.
 */
function logOut() {
    ngio.logOut(function() {
        /*
         * Because we have to log the player out on the server, you will want
         * to handle any post-logout stuff in this function, wich fires after
         * the server has responded.
         */
    });
}

initSession();

let medals = null;
let medalCallbacks = null;
function fetchMedals(ngio, callback) {
	if(medals) {
		callback(medals);
	} else if(medalCallbacks) {
		medalCallbacks.push(callback);
	} else {
		medalCallbacks = [callback];
		ngio.callComponent('Medal.getList', {}, result => {
			if(result.success) {
				medals = result.medals;
				medals.forEach(medal => console.log(medal.name, medal.unlocked));
				medalCallbacks.forEach(callback => {
					callback(medals);
				});
				medalCallbacks = null;
			}
		});
	}
}

let scoreboards = null;
let boardCallbacks = null;
function fetchScoreBoards(ngio, callback) {
    if(scoreboards) {
        callback(scoreboards);
    } else if(boardCallbacks) {
        boardCallbacks.push(callback);
    } else {
        boardCallbacks = [callback];
        ngio.callComponent('ScoreBoard.getBoards', {}, result => {
            if(result.success) {
                scoreboards = result.scoreboards;
                scoreboards.forEach(board => console.log(board.name, board.id));
                boardCallbacks.forEach(callback => {
                    callback(scoreboards);
                });
                boardCallbacks = null;
            }
        });        
    }
}

function postScore(ngio, name, value, callback) {
    if (!ngio.user) return;
    fetchScoreBoards(ngio, scoreboards => {
        const scoreboard = scoreboards.filter(board => board.name === name)[0];
        if(scoreboard) {
            ngio.callComponent('ScoreBoard.postScore', {id:scoreboard.id, value}, result => {
                if(callback) {
                    callback(result.score);
                }
            });
        }
    });
}

function unlockMedal(ngio, medal_name, callback) {
    // console.log('unlocking ', medal_name);
    /* If there is no user attached to our ngio object, it means the user isn't logged in and we can't unlock anything */
    if (!ngio.user) return;
//    return;
    fetchMedals(ngio, medals => {
    	const medal = medals.filter(medal => medal.name === medal_name)[0];
    	if(medal) {
    		if(!medal.unlocked) {
	    		ngio.callComponent('Medal.unlock', {id:medal.id}, result => {
	    			if(callback)
		    			callback(result.medal);
	    		});
    		} else {
    			if(callback)
	    			callback(medal);
    		}
    	}
    });
}
