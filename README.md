Для начала работы необходимо установить все зависимости в папках frontend и backend:
cd backend
npm i
cd ../frontend
npm i

Далее нужно создать телеграм бота.
Необходимо зайти в телеграм найти бота BotFather и написать ему следующие команды:
/newbot 
Будет предложено написать имя бота
После успешного создания вы получите токен
Нужно скопировать этот токен и вставить его в backend/src/index.ts в переменную token

Далее нужно настроить firebase
Заходим на сайт firebase создаем новый проект
После успешного создания проекта нужно зайти в него и сделать следующее:
Зайти в настройки проекта, вкладка General и в самом низу нажать на иконку </> чтобы создать новое приложение. Вводим имя приложения и нажимаем register app. Готово.

Затем нужно перейти в Authentication нажать set up 
В предложенных провайдерах выбрать phone, включить его и нажать save 

Затем в FirestoreDatabase и нажать create database
В предложенных вариантах выбрать нужную локацию сервера и нажать enable

Далее переходим во вкладку Realtime Database и жмем Create Database
В предложенных вариантах выбрать нужную локацию сервера и нажать enable

Далее снова переходим в настройки проекта во вкладку Service accounts
Жмем Generate new private key и скачиваем его
Затем открыть скачанный json файл скопировать все содержимое и вставить в backend/fbServiceAccountKey.json
Далее в той же вкладке чуть выше кнопки генерации ключа есть код. 
Копируем databaseURL и вставляем в backend/firebaseAdmin.js в databaseURL, который передается методу admin.initializeApp
На этом backend приложение настроено

frontend приложение необходимо задеплоить например в netlify или поднять свой сервер и уже там разместить приложение.
Далее нужно скопировать url вставить в backend/index.ts в пременную webAppUrl.
В firebase перейти в authentication вкладку settings и выбрать Authorized domains.
Нажать Add domain и вставить url
Далее перейти в BotFather и ввести /setmenubutton
Выбрать нужного бота 
Вставить url фронта 
Написать название кнопки, которая будет открывать сайт
Готово.

Теперь можно билдить бек и запускать его
npm run build 
npm run start