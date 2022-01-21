const forAnchors = () => {
    for (i = 0; i < document.getElementsByTagName('a').length; i++) {
        document.getElementById(document.getElementsByTagName('a')[i].id).addEventListener('click', (event) => {
            event.preventDefault();
            const a = new XMLHttpRequest();
            const b = event.target.pathname;
            a.open('GET', b, true);
            a.onload = () => {
                if (a.status == 200) {
                    document.body.innerHTML = new DOMParser().parseFromString(a.responseText, "text/html").body.innerHTML;
                    document.title = new DOMParser().parseFromString(a.responseText, "text/html").title;
                    window.history.pushState(null, null, b);
                    forAnchors();
                    getJSON('https://api.github.com/users', 'api');
                }
            }
            a.onerror = () => console.log('Error occured while loading ' + b + ".");
            a.send();
        });
        if ((document.getElementsByTagName('a')[i].href === window.location.href) && (typeof i !== undefined)) {
            document.getElementsByTagName('a')[i].style.pointerEvents = "none";
        }
    }
};
forAnchors();
/*
const crudGETText = (source, target) => {
    event.preventDefault()
    let xhr = new XMLHttpRequest();
    console.log(xhr);
    xhr.open('GET', source, true);
    xhr.onprogress = () => document.getElementById(target).innerHTML = "Loading..";
    xhr.onload = () => {
        if (xhr.status == 200) {
            document.getElementById(target).innerHTML = xhr.responseText;
        }
    }
    xhr.onerror = () => console.log('Error occured!');
    xhr.send();
}

const getObject = (source, target) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', source, true);
    xhr.onload = () => {
        if (xhr.status == 200) {
            let user = JSON.parse(xhr.responseText);
            document.getElementById(target).getElementsByClassName('user-name')[0].innerHTML = `${user.name}`;
            document.getElementById(target).getElementsByClassName('user-email')[0].innerHTML = `${user.email}`;
        }
    }
    xhr.send();
}
*/
const getJSON = (source, target, more) => {
    if (document.getElementById(target + '-0')) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', source, true);
        xhr.onload = () => {
            if (xhr.status == 200) {
                const db = JSON.parse(xhr.responseText);
                const elements = document.getElementById(target + '-0').getElementsByTagName('*');
                for (let e = 0; e < elements.length; e++) {
                    if (elements[e].id !== '') {
                        const detail = db[0][elements[e].id.replace(target + '-', '').replace('-0', '')];
                        if (elements[e].tagName !== 'IMG') { elements[e].innerHTML = detail; }
                        else if (elements[e].tagName = 'IMG') { elements[e].src = detail; };
                    }
                }
                let dup;
                for (let d = 1; d < db.length; d++) {
                    if (!document.getElementById(target + "-" + d)) {
                        dup = document.getElementById(target + "-0").cloneNode(true);
                        dup.id = target + '-' + d;
                        const elements2 = dup.getElementsByTagName('*');
                        for (let e = 0; e < elements2.length; e++) {
                            if (elements2[e].id !== '') {
                                elements2[e].id = elements2[e].id.replace('-0', '-' + d);
                                const detail = db[d][elements2[e].id.replace(target + '-', '').replace('-' + d, '')];
                                if (elements2[e].tagName !== 'IMG') { elements2[e].innerHTML = detail; }
                                else if (elements2[e].tagName = 'IMG') { elements2[e].src = detail; };
                            }
                        }
                        document.getElementById(target + '-' + (d - 1)).parentNode.insertBefore(dup, document.getElementById(target + '-' + (d - 1)).nextSibling);
                    }
                }
            }
        }
        xhr.send();
    }
}
getJSON('https://api.github.com/users', 'api');