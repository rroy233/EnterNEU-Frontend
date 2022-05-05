<template>
  <dir>
    <v-container>
      <v-alert
        type="success"
        v-if="valid == 1"
        transition="scroll-y-transition"
      >
        <v-row align="center">
          <v-col class="grow"> 您的凭证有效 </v-col>
          <v-col class="shrink">
            <v-btn text @click="showTips = true">说明文档</v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <v-alert type="info" v-if="valid == 0">加载中。。。</v-alert>
      <v-alert type="error" v-if="valid == -1" transition="scroll-y-transition"
        >您的凭证无效或已过期</v-alert
      >

      <v-row justify="center" class="mt-4" v-if="valid == -1">
        <v-btn to="/" class="mx-auto" depressed>重新生成</v-btn>
      </v-row>

      <!-- 卡片 -->
      <v-row class="d-flex my-2 mx-auto" v-if="valid == 1" max-width="344">
        <!-- 基本信息卡片 -->
        <v-col>
          <v-card>
            <v-card-title>凭证信息</v-card-title>
            <v-card-text>
              token：<code>{{ token }}</code
              >（获取信息的唯一凭证）<br />
              秘钥：<code>{{ key }}</code
              >（不完整将导致关键信息解密失败）<br />
              过期时间：<code>{{ oData.info.expTime }}</code
              ><br />
              <br />
              e码通页面入口：（每次都应从入口进入）<v-btn
                text
                color="primary"
                @click="doCopy(oData.info.checkUrl)"
                small
              >
                复制 </v-btn
              ><br /><code>{{ oData.info.checkUrl }}</code>
              <br />
              本页面(请保存！丢失无法找回！)：<v-btn
                text
                color="primary"
                @click="doCopy(oData.info.statusUrl)"
                small
              >
                复制 </v-btn
              ><br /><code>{{ oData.info.statusUrl }}</code>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="primary"
                :href="oData.info.checkUrl"
                target="_blank"
              >
                查看e码通页面
              </v-btn>
              <v-btn text color="error" :to="deleteUrl"> 删除 </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="d-flex my-2 mx-auto" v-if="valid == 1" max-width="344">
        <!-- 基本信息卡片 -->
        <v-col>
          <v-card>
            <v-card-title>Shadowrocket配置(iOS)</v-card-title>
            <v-card-text>
              <p>
                使用Shadowrocket软件的Url改写功能可实现“使用微信/智慧东大扫码，强行跳转至本站的页面”
              </p>
              <p>
                具体教程可查看-><v-btn
                  text
                  color="primary"
                  @click="showTips = true"
                  small
                >
                  说明文档
                </v-btn>
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="doCopy(shadowrocketUrl)">
                复制配置链接
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- 头像 -->
        <v-col>
          <v-card>
            <v-card-title>上传头像</v-card-title>
            <v-card-text>
              <div class="text--primary">
                您的头像数据将经AES加密处理后存储于服务器上，便于您使用。<br />
                放心，您的数据会按照您的设定进行定时删除。
              </div>
              <p>允许格式：jpg和png（图片大小不宜过大）</p>

              <v-card-actions>
                <v-btn
                  text
                  color="teal accent-4"
                  @click="reveal = true"
                  :disabled="oData == null || oData.ImgUploaded == true"
                >
                  {{
                    oData != null && oData.ImgUploaded == true
                      ? "已上传"
                      : "上传"
                  }}
                </v-btn>
              </v-card-actions>
            </v-card-text>

            <v-expand-transition>
              <v-card
                v-if="reveal"
                class="transition-fast-in-fast-out v-card--reveal"
                style="height: 100%"
              >
                <v-card-title>上传</v-card-title>
                <v-card-text class="pb-0">
                  <v-file-input
                    v-model="upload.file"
                    placeholder="选择文件"
                    prepend-icon="mdi-image"
                    label="选择文件"
                    small
                  ></v-file-input>

                  <v-card-actions class="pt-2">
                    <v-btn
                      text
                      color="primary"
                      @click="uploadImg"
                      :loading="upload.loading"
                    >
                      上传
                    </v-btn>
                    <v-btn text @click="reveal = false"> 取消 </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>

      <!-- 提示框 -->
      <v-dialog v-model="config.alert" max-width="450px">
        <v-card>
          <v-card-title>{{ config.alert_type }}</v-card-title>
          <v-card-text>
            {{ config.alert_text }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="config.alert = !config.alert"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <Tips :show="showTips" @close="showTips = false"></Tips>
    </v-container>
  </dir>
</template>

<script>
import Tips from "../components/Tips.vue";
export default {
  name: "status",
  components: {
    Tips,
  },
  data: function () {
    return {
      token: "",
      valid: 0,
      key: "",
      oData: {},
      reveal: false,
      config: {
        alert_text: "",
        alert_type: "info",
        alert: false,
      },
      upload: {
        loading: false,
        file: null,
      },
      showTips: false,
    };
  },
  mounted: function () {
    this.token = this.$route.params.token;
    this.key = this.$route.params.key;
    this.init();
  },
  methods: {
    init: function () {
      this.axios({
        url: "/api/" + this.token + "/" + this.key + "/status",
        method: "get",
      })
        .then((res) => {
          if (res.data.status == 0) {
            this.valid = 1;
            this.oData = res.data.data;
          } else {
            this.valid = -1;
            this.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.error(err);
        });
    },
    uploadImg: function () {
      var _this = this;
      let param = new FormData();
      param.append("file", this.upload.file);
      this.upload.loading = true;
      this.axios({
        method: "post",
        url: "/api/upload?token=" + this.token + "&key=" + this.key,
        headers: {
          "Content-type": "multipart/form-data;charset:utf-8",
        },
        data: param,
      })
        .then(function (res) {
          if (res.data.status == 0) {
            _this.upload.loading = false;
            _this.reveal = false;
            _this.success("上传成功");
            _this.init();
          } else {
            _this.error(res.data.msg);
          }
        })
        .catch((err) => {
          _this.error(err);
        });
    },
    doCopy: function (text) {
      var _this = this;
      this.$copyText(text).then(
        function () {
          _this.success("拷贝成功");
        },
        function (e) {
          _this.error("拷贝成功" + e);
        }
      );
    },
    success: function (text) {
      this.config.alert = !this.config.alert;
      this.config.alert_text = text;
      this.config.alert_type = "成功";
    },
    error: function (err) {
      this.config.alert = !this.config.alert;
      this.config.alert_text = err;
      this.config.alert_type = "错误";
    },
  },
  computed: {
    deleteUrl: function () {
      return "/delete/" + this.token + "/" + this.key;
    },
    shadowrocketUrl: function () {
      return this.oData.info.checkUrl + "/shadowrocket";
    },
  },
};
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
