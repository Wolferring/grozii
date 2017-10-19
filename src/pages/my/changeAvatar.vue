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
      <f7-link :disabled="!fileChoose"   :class="{'text-sub':fileChoose}" @click="finish('blob')">
        保存
      </f7-link>
    </f7-nav-right>
  </f7-navbar>
  <div class="container">
      <croppa 
        v-model="croppa"
        :width="240"
        :height="240"
        placeholder="点击上传图片"
        :show-remove-button="false"
        canvas-color="#ececec"
        :placeholder-font-size="14"
        accept="image/png,image/jpg,image/jpeg"
        :prevent-white-space="true"
        initial-size="cover"
        @file-choose="fileChoose=true"
      >
        <img
          crossOrigin="anonymous"
         :src="user.info.avatar"
         slot="initial">
      </croppa>
    <div class="padding">
      <button class="btn btn-gradient btn-lg btn-center" @click="croppa.chooseFile()">选择图片</button>

    </div>
  </div>
</f7-page>
</template>
<style lang="less">
#changeAvatar {
    .container{
      .btn{
        width: 100%;
        box-sizing: border-box;
      }
    }
    .vue-cropper{
      background-image: none;
      background-color: #f5f5f5;
    }
    .croppa-container{
      text-align: center;
      margin-top: 20px;
      canvas{
        border-radius: 50%;
        border:4px solid #ececec;
      }
    }
    .padding{
      padding: 15px 10px;
    }
}
</style>
<script>
import api from '../../store/api.js'
export default {
  data() {
    return {
        croppa:{},
        fileChoose:false
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
        this.croppa.generateBlob(blob=>{
            const updata = new FormData();
            updata.append('avatar',blob);
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
    },
  }
}
</script>
