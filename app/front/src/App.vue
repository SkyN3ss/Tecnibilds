<style lang="scss">
    .notification-card{
        max-height: 350px;
        overflow-y: scroll;
    }
</style>

<template>
    <div id="app">
        <v-app id="inspire">


            <v-navigation-drawer
                    v-if="isAuthenticated"
                    fixed
                    clipped
                    app
                    v-model="drawer"
                    :mini-variant.sync="mini"
            >
                <v-toolbar flat class="transparent">
                    <v-list class="pa-0">
                        <v-list-tile avatar>
                            <v-list-tile-avatar>
                                <img v-if="user.picture" :src="ApiUsersPics + user.picture" :alt="user.name"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ user.name }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon @click.native.stop="mini = !mini">
                                    <v-icon>chevron_left</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-toolbar>
                <v-list dense>
                    <v-divider></v-divider>
                    <template v-for="(item, i) in items">
                        <v-layout
                                :key="i"
                                row
                                v-if="item.heading"
                                align-center
                        >
                            <v-flex xs6>
                                <v-subheader v-if="item.heading">
                                    {{ item.heading }}
                                </v-subheader>
                            </v-flex>
                        </v-layout>
                        <v-list-group v-else-if="item.children" v-model="item.model" no-action>
                            <v-list-tile slot="item" :to="item.to">
                                <v-list-tile-action>
                                    <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile
                                    v-for="(child, i) in item.children"
                                    :key="i"
                                    :to="child.to"
                            >
                                <v-list-tile-action v-if="child.icon">
                                    <v-icon>{{ child.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ child.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-tile v-else :to="item.to">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-divider></v-divider>
                    <v-spacer></v-spacer>
                    <!-- DATE PICKER NAVIGATION -->
                    <!-- <v-flex xs2>
                         <v-date-picker
                                 v-model="datePicker"
                                 :first-day-of-week="1"
                                 locale="es-sp">

                         </v-date-picker>
                     </v-flex> -->
                </v-list>
            </v-navigation-drawer>
            <!-- TOOLBAR APP -->
            <v-toolbar app color="blue darken-3" dark clipped-left fixed v-if="isAuthenticated">
                <v-toolbar-title
                        :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'"
                        class="ml-0 pl-3">
                    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                    <span class="hidden-xs-only">{{ appName }}</span>
                </v-toolbar-title>
                <v-text-field
                        light
                        solo
                        prepend-icon="search"
                        placeholder="Buscar"
                        style="max-width: 500px; min-width: 128px"
                ></v-text-field>
                <div class="d-flex align-center" style="margin-left: auto">
                    <v-btn icon>
                        <v-icon>apps</v-icon>
                    </v-btn>
                    <v-menu
                            offset-x
                            offset-y
                            :close-on-content-click="false"
                            :nudge-width="200"
                            v-if="notifications"
                    >
                        <v-btn icon slot="activator">
                            <v-badge overlay color="purple" overlap>
                                <span slot="badge" v-if="notifications.length">{{ notifications.length }}</span>
                                <v-icon>notifications</v-icon>
                            </v-badge>
                        </v-btn>
                        <v-card class="notification-card">
                            <v-list>
                                <v-list-tile avatar v-for="(notification,i) in notifications" :key="i">
                                    <v-list-tile-avatar>
                                        <img v-if="notification.data.userComm"
                                             :src="ApiUsersPics + notification.data.userComm.picture"
                                             :alt="notification.data.userComm.name">
                                        <img v-if="notification.data.customer"
                                             :src="ApiCustomersPics + notification.data.customer.picture"
                                             :alt="notification.data.customer.name">
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <span v-if="notification.data.userComm">{{ notification.data.userComm.name + notification.data.header }}</span>
                                            <span v-if="notification.data.customer">{{ notification.data.header + '  ' + notification.data.customer.name + '  ' + notification.data.customer.last_name }}</span>
                                            <span v-if="notification.data.invoice">{{ notification.data.header}}</span>
                                        </v-list-tile-title>
                                        <v-list-tile-sub-title>
                                            <span class="caption" v-if="notification.data.post">{{ notification.data.post.content }}</span>
                                            <span class="caption" v-if="notification.data.invoice">{{ notification.data.invoice.title }}</span>
                                            <span class="caption" v-if="notification.data.customer">{{ notification.data.customer.company }}</span>
                                        </v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-btn icon @click="deleteNotification(notification)">
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-layout v-if="! notifications.length" row align-center align-content-center justify-center>
                                    <span class="caption">¡No tienes notificaciones!</span>
                                </v-layout>
                            </v-list>
                            <v-divider></v-divider>
                        </v-card>
                    </v-menu>
                    <!-- User Logged Menu -->
                    <v-menu
                            offset-x
                            offset-y
                            :close-on-content-click="false"
                            :nudge-width="200"
                    >
                        <v-btn icon large slot="activator">
                            <v-avatar size="32px">
                                <img v-if="user.picture" :src="ApiUsersPics + user.picture" :alt="user.name"/>
                            </v-avatar>
                        </v-btn>
                        <v-card>
                            <v-list>
                                <v-list-tile avatar>
                                    <v-list-tile-avatar>
                                        <img v-if="user.picture" :src="ApiUsersPics + user.picture" :alt="user.name">
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ user.name }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-btn icon to="/settings">
                                            <v-icon>settings</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                            <v-divider></v-divider>
                            <v-list>
                                <v-list-tile>
                                    <v-list-tile-action>
                                        <v-switch color="purple"></v-switch>
                                    </v-list-tile-action>
                                    <v-list-tile-title>Enable messages</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-action>
                                        <v-switch color="purple"></v-switch>
                                    </v-list-tile-action>
                                    <v-list-tile-title>Enable hints</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat @click="logout()">
                                    Cerrar Sesion
                                    <v-icon>exit_to_app</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>
                </div>
            </v-toolbar>
            <v-content>
                <v-slide-y-transition mode="out-in">
                    <router-view></router-view>
                </v-slide-y-transition>
            </v-content>
            <v-footer app fixed class="blue darken-2">
                <v-layout row wrap align-center>
                    <v-flex xs12>
                        <div class="white--text ml-3">
                            <span>{{appCompany}} &copy; 2017, </span>
                            Made with
                            <v-icon class="red--text">favorite</v-icon>
                            by <a class="white--text" href="mailto:joshua@tecnibilds.com.ve" target="_blank">Joshua
                            Martinez.</a>
                        </div>
                    </v-flex>
                </v-layout>
            </v-footer>
            <v-snackbar
                    :timeout="2000"
                    bottom
                    v-model="snackBar"
            >
                {{ snackText }}
                <v-btn flat color="pink" @click.native="snackbar = false" icon>
                    <v-icon>close</v-icon>
                </v-btn>
            </v-snackbar>
        </v-app>
        <!-- set progressbar -->
        <vue-progress-bar></vue-progress-bar>
    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import Meta from './mixins/meta'

  export default {
    mixins: [Meta],

    data() {
      return {
        appName: this.$configs.appName,
        appCompany: this.$configs.appCompany,
        appLogo: this.$configs.appLogo,
        outRedirect: '/',
        ApiUsersPics: this.$configs.ApiUrl + 'images/users/',
        ApiCustomersPics: this.$configs.ApiUrl + 'images/customers/',

        snackBar: false,
        snackText: '',

        dialog: false,
        drawer: null,
        mini: true,
        datePicker: null,
        items: [
          {icon: 'date_range', text: 'Inicio', to: '/dashboard'},
          {icon: 'shopping_cart', text: 'Facturas', to: '/invoices'},
          {icon: 'work', text: 'Clientes', to: '/customers'},
          {icon: 'content_copy', text: 'Productos', to: '/products'},
          {icon: 'shopping_basket', text: 'Proveedores', to: '/providers'},
          {icon: 'perm_identity', text: 'Empleados', to: '/employees'},
          {icon: 'supervisor_account', text: 'Usuarios', to: '/users'},
          {icon: 'insert_chart', text: 'Analytics', to: '/analytics'},
          {icon: 'chat', text: 'Chat', to: '/chat'},
          {icon: 'settings', text: 'Ajustes', to: '/settings'},
          {icon: 'help', text: 'Ayuda', to: '/help'},
        ]
      }
    },
    created() {
      let vm = this;
      if (vm.isAuthenticated) {
        if (vm.checkToken) {
          vm.setAuthenticatedUser();
        } else {
          // Is Auth But token expired -> logout()
          vm.logout();
        }
      } else {
        // is not auth expecting for login()
      }
      /* {{ JSON.parse(notification.data).post.content }} */
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'isAuthenticated',
        user: 'getAuthenticatedUser',
        notifications: 'getNotifications',
      }),
    },
    methods: {
      ...mapActions({
        checkToken: 'checkToken',
      }),
      setAuthenticatedUser() {
        let vm = this;
        vm.$store.dispatch('setAuthenticatedUser')
            .then(response => {
              if(vm.user.id) {
                vm.joinNotifyChannel(vm.user.id);
              }
            })
            .catch(error => {
             console.log(error)
            })
      },
      logout() {
        let vm = this;
        vm.$store.dispatch('logout')
            .then(redirect => {
              vm.$router.push(redirect);
            })
            .catch(error => {
              console.log(error)
            })
      },
      joinNotifyChannel(UserID) {
        let vm = this;
        vm.$echo.private('Tbappback.User.' + UserID)
            .listen('.Illuminate.Notifications.Events.BroadcastNotificationCreated', (notification) => {
              vm.$store.commit('SAVE_NOTIFICATION', notification);
            });
      },
      deleteNotification(notification) {
        let vm = this;
        vm.$Progress.start();
        vm.$store.dispatch('deleteUserNotification', notification)
            .then(response => {
              vm.snackText = '¡Notificación borrada Exitosamente!';
              vm.snackBar = true;
              vm.$Progress.finish();
            })
            .catch(error => {
              vm.$Progress.fail();
            })
      }
    }
  }
</script>