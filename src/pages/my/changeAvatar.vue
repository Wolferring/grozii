<template>
<f7-page navbar-fixed no-toolbar class="changeAvatar no-toolbar" id="changeAvatar">
  <f7-navbar sliding class="navbar-black">
    <f7-nav-left>
      <f7-link icon-only back>
        <i class="iconfont icon-back">

        </i>
      </f7-link>
    </f7-nav-left>
    <f7-nav-center>
      修改头像
    </f7-nav-center>
    <f7-nav-right>
      <f7-link :disabled="!avatarUp.img.length" :class="{'text-sub':avatarUp.img.length}" @click="finish('blob')">
        保存
      </f7-link>
    </f7-nav-right>
  </f7-navbar>
  <div class="container">
    <div class="text-center avatar-old" v-show="!avatarUp.img.length">
      <div class="avatar">
        <img :src="user.info.avatar" alt="">
      </div>
    </div>
    <transition name="fade">
    <div class="cropper-area" v-show="avatarUp.img.length">
        <vueCropper
          ref="cropper"
          :img="avatarUp.img"
          :outputSize="avatarUp.size"
          :outputType="avatarUp.outputType"
          :info="avatarUp.info"
          :canScale="avatarUp.canScale"
          :autoCrop="avatarUp.autoCrop"
          :autoCropWidth="avatarUp.width"
          :autoCropHeight="avatarUp.height"
          :fixed="avatarUp.fixed"
          :fixedNumber="avatarUp.fixedNumber"

        ></vueCropper>
    </div>
    </transition>
    <div class="padding">
      <input type="file" id="avatar-upload" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)">
      <label class="btn btn-gradient btn-lg btn-center" for="avatar-upload">选择图片</label>
    </div>
  </div>
</f7-page>
</template>
<style lang="less" scoped>
.changeAvatar {
    .content {
        margin: auto;
        margin-bottom: 100px;
    }
    .test-button {
        display: flex;
        flex-wrap: wrap;
    }
    .vue-cropper{
      background-image: none;
      background-color: #f5f5f5;
    }
    .avatar-old{
      margin:20px auto;
      .avatar{
        width: 3rem;
        height: 3rem;
      }
    }
    .cropper-view-box{
        img{
            display: none;
        }
    }
    .cropper-area {
        height: 350px;
    }
    .padding{
      padding: 15px 10px;
    }
    @keyframes slide {
        0% {
            background-position: 0 0;
        }
        100% {
            background-position: -100% 0;
        }
    }
}
</style>
<script>
import VueCropper from 'vue-cropper'
import api from '../../store/api.js'

export default {
  components: {
    'vueCropper': VueCropper,
  },
  data() {
    return {
          avatarUp: {
              img: '',
              info: false,
              size: 1,
              outputType: 'jpeg',
              canScale: false,
              autoCrop: true,
              // 只有自动截图开启 宽度高度才生效
              width: 120,
              height: 120,
              fixed: true,
              fixedNumber: [3, 3]
          },
     }
  },
  computed: {
      user(){
          return this.$store.getters.getUser
      }
  },
  destroyed() {
      this.$store.dispatch("getUserInfo")
  },
  methods: {
    finish (type) {
        var self=this;
        if (type === 'blob') {
            this.$refs.cropper.getCropBlob((data) => {
              const updata = new FormData();
              updata.append('avatar',data);
              try{
                plus.nativeUI.showWaiting()
              }catch(e){}
              api.changeMyAvatar(updata,(data)=>{
                  if(data.code!=2000){
                    self.$toast.center(data.msg||"修改失败")
                    plus.nativeUI.closeWaiting()
                    return false;
                  }
                  self.$router.back()
                  self.$toast.center("修改成功")
                  plus.nativeUI.closeWaiting()
              })
            })
        }
    },

    uploadImg (e) {
        //上传图片
        var file = e.target.files[0]
        if(!file){
          return false;
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          this.avatarUp.img = e.target.result
        }
        reader.readAsDataURL(file)
    }
  }
}
</script>
