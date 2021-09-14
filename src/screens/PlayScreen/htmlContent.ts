export const htmlContent = `
<!DOCTYPE html>
<html style="height: 100%">
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="height: 100%; margin: 0">
    <div id="container" style="height: 100%"></div>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/echarts@4/dist/echarts.min.js"
    ></script>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/echarts-gl@1/dist/echarts-gl.min.js"
    ></script>
    <script type="text/javascript">
      window.addEventListener(
        'load',
        () => {
          run();
        },
        false,
      );
      function run() {
        var ROOT_PATH = 'http://192.168.31.221:8000'; // 'https://echarts.apache.org/v4/examples';
        var dom = document.getElementById('container');
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        var UPDATE_DURATION = 100;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        var audioContext = new AudioContext();

        var oReq = new XMLHttpRequest();
        oReq.open('GET', ROOT_PATH + '/src/assets/01.mp3', true);
        oReq.responseType = 'arraybuffer';

        oReq.onload = function (e) {
          audioContext.decodeAudioData(oReq.response, initVisualizer);
        };
        oReq.send();

        function initVisualizer(audioBuffer) {
          console.log('inninini');
          inited = true;

          var source = audioContext.createBufferSource();
          source.buffer = audioBuffer;

          // Must invoked right after click event
          if (source.noteOn) {
            source.noteOn(0);
          } else {
            source.start(0);
          }

          // 音量处理
          var gainNode = audioContext.createGain();
          gainNode.gain.value = 1;
          // gainNode.gain.setValueAtTime(1, audioContext.currentTime);

          var analyzer = audioContext.createAnalyser();
          analyzer.fftSize = 4096;

          // 音频连接
          source.connect(gainNode);
          gainNode.connect(analyzer);
          analyzer.connect(audioContext.destination);

          var frequencyBinCount = analyzer.frequencyBinCount;
          var dataArray = new Uint8Array(frequencyBinCount);

          var beta = 0;
          // 定时去获取音频动画数据
          function update() {
            analyzer.getByteFrequencyData(dataArray);

            var item = [];
            var size = 50;
            var dataProvider = [];

            for (var i = 0; i < size * size; i++) {
              var x = i % size;
              var y = Math.floor(i / size);
              var dx = x - size / 2;
              var dy = y - size / 2;

              var angle = Math.atan2(dy, dx);
              if (angle < 0) {
                angle = Math.PI * 2 + angle;
              }
              var dist = Math.sqrt(dx * dx + dy * dy);
              var idx = Math.min(
                frequencyBinCount - 1,
                Math.round((angle / Math.PI / 2) * 60 + dist * 60) + 100,
              );

              var val = Math.pow(dataArray[idx] / 100, 3);
              dataProvider.push([x, y, Math.max(val, 0.1)]);
            }

            myChart.setOption({
              grid3D: {
                viewControl: {
                  beta: beta,
                  alpha:
                    ((Math.sin(beta / 10 + 40) * ((beta % 10) + 5)) / 15) * 30 +
                    30,
                  distance:
                    ((Math.cos(beta / 50 + 20) * ((beta % 10) + 5)) / 15) * 50 +
                    80,
                  animationDurationUpdate: UPDATE_DURATION,
                  animationEasingUpdate: 'linear',
                },
              },
              series: [
                {
                  data: dataProvider,
                },
              ],
            });
            beta += 2;

            setTimeout(update, UPDATE_DURATION);
          }

          update();
        }

        option = {
          tooltip: {},
          background: '#212121',
          visualMap: {
            show: false,
            min: 0.1,
            max: 4,
            inRange: {
              color: ['#010103', '#2f490c', '#b0b70f', '#fdff44', '#fff'],
            },
          },
          xAxis3D: {
            type: 'value',
          },
          yAxis3D: {
            type: 'value',
          },
          zAxis3D: {
            type: 'value',
            min: -6,
            max: 6,
          },
          grid3D: {
            show: false,
            environment: '#212121',
            viewControl: {
              distance: 100,
            },
            postEffect: {
              enable: true,
              FXAA: {
                enable: true,
              },
            },
            light: {
              main: {
                shadow: true,
                intensity: 10,
                quality: 'high',
              },
              ambientCubemap: {
                texture: ROOT_PATH + '/src/assets/canyon.hdr',
                exposure: 0,
                diffuseIntensity: 0.2,
              },
            },
          },
          series: [
            {
              type: 'bar3D',
              silent: true,
              shading: 'lambert',
              data: [],
              barSize: 1,
              lineStyle: {
                width: 4,
              },
              // animation: false,
              animationDurationUpdate: UPDATE_DURATION,
            },
          ],
        };
        if (option && typeof option === 'object') {
          myChart.setOption(option, true);
        }
      }
    </script>
  </body>
</html>

`;
