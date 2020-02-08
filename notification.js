module.exports.isNull = function isNull(filePath) {
    // Проверка поддержки браузером уведомлений
    if (!("Notification" in window)) {
        alert("Браузер не поддерживает уведомления...");
    }
    // Проверка разрешения на отправку уведомлений
    else if (Notification.permission === "granted") {
        // Если разрешено, то создаем уведомление
        if (filePath)
            var notification = new Notification('UnterAV' , {body:"Корректный ввод !"});
        else
            var notification = new Notification('UnterAV' , {body:"Введите пожалуйста данные..."});
    }
}