/*
    * 1. 최초
    * 서비스워커 등록시도 -> install 완료 -> (필요시) 캐시스토리지저장 -> 서비스 워커 등록 완료 -> activate!
    *
    * 2. 최초가 이닌경우
    * fetch 이벤트 발생 -> http request에 캐시스토리지에 데이터가 있자면 캐시데이터 리턴, 없으면 네트워크 요청 -> 서비스 워커 등록완료
    */


    // New Service Worker
    let newWorker;

    function showUpdateBar() {
      let snackbar = document.getElementById('snackbar');
      snackbar.className = 'show';
    }

    // The click event on the notification
    document.getElementById('reload').addEventListener('click', function(){
      newWorker.postMessage({action: 'skipWaiting'});
    });

    // 1. 서비스 워커 등록
    if('serviceWorker' in navigator){

      console.log('1. 서비스 워커 등록 시도');
      navigator.serviceWorker.register('./serviceWorker.js').then(function(reg){
        console.log('1. 서비스 워커 등록완료 ::', reg);
        reg.addEventListener('updatefound', function(){

          console.log('updatefound!!!', reg.installing);

          // An updated service worker has appeared in reg.installing!
          // 업데이트된 서비스 워커가 나타나면
          newWorker = reg.installing;

          newWorker.addEventListener('statechange', function(){

            console.log('statechange::', newWorker.state, navigator.serviceWorker);
            // Has service worker state changed ?
            switch(newWorker.state){
              case 'installed':

                console.log('newWorker.state is installed', navigator.serviceWorker.controller)
                // There is a new service worker available,show the notification
                // 새로운 서비스 워커가 있으면 노티를 보여줘라
                if(navigator.serviceWorker.controller){
                  console.log('navigator.serviceWorker.controller');
                  showUpdateBar();
                }

              break;
            }

          });
        });
      });


      let refreshing;
      // The event listener that is fired when the service worker updates
      // Here we reload the page
      // 서비스워커가 업데이트 될 때 실행됨
      navigator.serviceWorker.addEventListener('controllerchange', function(){
        // console.log('controllerchange 발생!!', refreshing);
        // if (refreshing) return;
        // console.log('reload 오나 ???');
        // window.location.reload();
        // refreshing = true;
         console.log('controllerchange 새로고침!!');
         window.location.reload();
        //if()
      });
    }