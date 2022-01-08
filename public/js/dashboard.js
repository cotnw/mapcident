function render(user) {
    document.getElementById('dname').innerHTML = user.name + '!';
    document.getElementById('name').innerHTML = user.name
    document.getElementById('gp').innerHTML = user.gender + ', ' + user.phone_number
    document.getElementById('epn').innerHTML = user.emergency_contact.phone_number
    document.getElementById('at').innerHTML = user.alert_time + 's'
    document.getElementById('karma').innerHTML = user.karma
    user.past_records.slice().reverse().forEach((record) => {
        document.getElementById('past-records').innerHTML += `<div class="record">
        <div class="top-record">
            <p>${record.date} ${record.month}<br><span style="font-weight: 400; color: #474747;">${record.day}</span></p>
            <p style="font-size: 6vw; font-weight: 400; color: #474747;margin-top: 4vw">${record.totalTime}</p>
        </div>
        <div class="bottom-record">
            <img src="https://cdn.discordapp.com/attachments/872743735388172318/929265924463284255/unknown.png">
            <p style="font-size: 12vw;display: flex; margin-top: 5vw;">+${record.creditsEarned}<img src="https://cdn.discordapp.com/attachments/872743735388172318/929255270700433458/unknown.png"></p>
        </div>
    </div>`
    })
}

window.onload = () => {
    if (localStorage.getItem('accessToken') === null) {
        window.location.href = '/register';
    } else {
        if (window.screen.width > 500) {
            window.location.href= '/phone'
        } else {
            document.getElementsByTagName('body')[0].style.display = 'block'
        }
        console.log("coming here")
        fetch(`/dashinfo?accessToken=${localStorage.getItem('accessToken')}`, { method: "GET" })
        .then(async (response) => {
            const data = await response.json();
            if (data.success === true) {
                render(data.user)
            } else {
                window.location.href = '/register'
            }
        })
        .catch((err) => {console.log(err)});
    }
}