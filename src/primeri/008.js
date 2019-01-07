import $ from 'jquery';
import * as rxjs from 'rxjs';

import githubApi from '../utils/githubApi';

export function main()
{
    // const githubPromise = new Promise((resolve, reject) => {
    //     console.log("Creating a promise...");

    //     setTimeout(() => {
    //         console.log("Something...");
    //         resolve("Hello from promise!");
    //     }, 2000);
    // });

    // // Bez tokova:
    // // githubPromise
    // // .then(result => {
    // //     console.log(result);
    // // });

    // // Kreiranje toka iz obecanja se vrsi pozivom operatora from
    // rxjs.from(githubPromise)
    //     .subscribe(getSubscriber("promise"));

    $("#profile").hide();

    function getGithubUser(username)
    {
        let clientId = githubApi.clientId;
        let clientSecret = githubApi.clientSecret;

        return $.ajax(`https://api.github.com/users/${username}?client_id=${clientId}&client_secret=${clientSecret}`, {
            dataType: 'jsonp'
        }).promise();
    }

    function displayGitHubUser(user)
    {
        $("#profile").show();
        $("#username").text(user.data.login);
        $("name").text(user.data.name);
        $("img").attr("src", user.data.avatar_url);
        $("#public_repos").text(user.data.public_repos);
        $("#followers").text(user.data.followers);
        $("#following").text(user.data.following);
        $("#html_url").attr("href", user.data.html_url);
    }
    
    rxjs.fromEvent($("#search"), "keyup")
        .subscribe(event => {
            let username = event.target.value;
            if (username === "")
            {
                $("#profile").hide();
            }
            else 
            {
                rxjs.from(getGithubUser(username))
                    .subscribe(user => displayGitHubUser(user));
            }
        });
}