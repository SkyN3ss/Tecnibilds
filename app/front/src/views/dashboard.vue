<style lang="scss">
    .DashCharts {
        max-height: 200px;
    }

    .posts {
        max-height: 310px;
        overflow-y: scroll;
    }
</style>

<template>
    <v-layout column wrap>
        <v-toolbar color="blue" dark>
            <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>more_vert</v-icon>
            </v-btn>
        </v-toolbar>
        <!-- Simple Cards -->
        <v-layout row justify-space-around class="mt-3" wrap>
            <v-flex xs12 md4 lg4 v-for="(card, i) in simpleCards" :key="i">
                <v-card class="ma-3">
                    <v-layout row>
                        <v-btn :color="card.color" fab dark>
                            <v-icon>{{ card.icon }}</v-icon>
                        </v-btn>
                        <v-layout column>
                            <v-flex xs10>
                                <div>
                                    <div class="headline">{{ card.title }}</div>
                                    <div class="caption grey--text">{{ card.subTitle }}</div>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- Charts Cards -->
        <v-layout row justify-space-around class="" wrap>
            <v-flex xs12 md4 lg4 v-for="(card, i) in chartCards" :key="i">
                <v-card class="ma-3">
                    <v-card-title>
                        <v-layout row>
                            <v-flex>
                                <div>
                                    <span class="headline">{{ card.title }}</span>
                                </div>
                                <div>
                                    <span class="caption grey--text">{{ card.subTitle }}</span>
                                </div>
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <div>
                                    <v-btn icon>
                                        <v-icon>refresh</v-icon>
                                    </v-btn>
                                    <v-menu bottom left>
                                        <v-btn icon slot="activator">
                                            <v-icon>more_vert</v-icon>
                                        </v-btn>
                                        <v-list>
                                            <v-list-tile>
                                                <v-list-tile-title>asd</v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-flex xs12>
                        <line-chart class="DashCharts" :data="card.lChart.data"
                                    :options="card.lChart.options"></line-chart>
                    </v-flex>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- Post Card & CALENDAR ROW -->
        <v-layout row justify-space-around class="mt-3" wrap>
            <v-flex xs12 md6 lg6>
                <v-card class="ma-3">
                    <v-toolbar color="cyan" dark>
                        <v-toolbar-title>Posts recientes</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon v-on:click="setDashboard()">
                            <v-icon>refresh</v-icon>
                        </v-btn>
                        <v-menu bottom left>
                            <v-btn icon slot="activator">
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                            <v-list>
                                <v-list-tile @click.stop="createPostDialog = true">
                                    <v-list-tile-title>Crear Nuevo Post</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </v-toolbar>
                    <v-expansion-panel focusable class="posts" v-chat-scroll>
                        <v-expansion-panel-content v-for="post in filteredPosts" :key="post.id">
                            <div slot="header">
                                <v-layout row>
                                    <v-flex xs1>
                                        <v-layout align-center>
                                            <v-avatar size="32px">
                                                <img v-bind:src="ApiUsersPics + post.user.picture"
                                                     :alt="post.user.name"/>
                                            </v-avatar>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs11>
                                        <v-layout row align-start>
                                            <v-layout column>
                                                <span class="caption mr-3" color="blue">{{ post.user.name }}</span>
                                                <span class="caption grey--text">{{ post.created_at | moment("from", "now") }}</span>
                                            </v-layout>
                                            <v-layout column>
                                                <span class="body-1">{{post.content}}</span>
                                            </v-layout>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </div>
                            <v-card>
                                <v-layout align-content-center justify-center align-center>
                                    <v-flex xs11>
                                        <div v-for="comment in post.post_comments" :key="comment.id"
                                             class="grey lighten-3">
                                            <v-card-text>
                                                <v-layout row>
                                                    <v-flex xs1>
                                                        <v-layout align-center>
                                                            <v-avatar size="32px">
                                                                <img v-bind:src="ApiUsersPics + comment.user.picture"
                                                                     :alt="comment.user.name"/>
                                                            </v-avatar>
                                                        </v-layout>
                                                    </v-flex>
                                                    <v-flex xs11>
                                                        <v-layout row align-start>
                                                            <v-layout column>
                                                                <span class="caption mr-3" color="blue">{{comment.user.name}}</span>
                                                                <span class="caption grey--text">{{ comment.created_at | moment("from", "now") }}</span>
                                                            </v-layout>
                                                            <v-layout column>
                                                                <span class="body-1">{{comment.content}}</span>
                                                            </v-layout>
                                                        </v-layout>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                            <v-divider></v-divider>
                                        </div>
                                        <v-card-actions>
                                            <v-text-field
                                                    label="Escribe tu Comentario..."
                                                    v-model="newPostComment"
                                                    id="newPostComment"
                                                    name="newPostComment"
                                                    v-on:keypress.enter="sendNewComment(post.id)"
                                                    required
                                            ></v-text-field>
                                            <v-btn icon>
                                                <v-icon color="grey">attach_file</v-icon>
                                            </v-btn>
                                            <v-btn icon>
                                                <v-icon color="grey">camera_alt</v-icon>
                                            </v-btn>
                                            <v-btn icon v-on:click="sendNewComment(post.id)">
                                                <v-icon color="blue">send</v-icon>
                                            </v-btn>
                                        </v-card-actions>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                            <v-layout v-show="posts.newPosts.length === 0" row align-center align-content-center
                                      justify-center>
                                <span class="headline">No hay nada aquí Todavía</span>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-card>
            </v-flex>
            <!-- Calendar -->
            <v-flex xs12 md6 lg6>
                <v-date-picker
                        full-width
                        class="ma-3"
                        color="green lighten-1"
                        v-model="datePicker"
                        :first-day-of-week="1"
                        locale="es-sp">
                </v-date-picker>
            </v-flex>
        </v-layout>
        <v-snackbar
                :timeout="3000"
                bottom
                v-model="snackBar"
        >
            {{ successMessage }}
            <v-btn flat color="pink" @click.native="snackBar = false">Close</v-btn>
        </v-snackbar>
        <v-dialog
                v-model="createPostDialog"
                fullscreen
                transition="dialog-bottom-transition"
                :overlay="false"
                scrollable
        >
            <v-card tile>
                <v-toolbar card dark color="primary">
                    <v-btn icon @click.native="createPostDialog = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Crear nuevo Post</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.native="createNewPost()">Save</v-btn>
                    </v-toolbar-items>
                    <v-menu bottom right offset-y>
                        <v-btn slot="activator" dark icon>
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list>
                            <v-list-tile>
                                <v-list-tile-title>Some Action</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-toolbar>
                <v-card-text>
                    <v-list three-line subheader>
                        <v-subheader>Crear nuevo Post</v-subheader>
                        <v-list-tile avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>Post Title</v-list-tile-title>
                                <v-list-tile-sub-title>
                                    <v-text-field
                                            name="postTitle"
                                            v-model="newPost.title"
                                            single-line
                                            required
                                    ></v-text-field>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>My Post Content</v-list-tile-title>
                                <v-list-tile-sub-title>
                                    <v-text-field
                                            name="postContent"
                                            v-model="newPost.content"
                                            single-line
                                            required
                                    ></v-text-field>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list three-line subheader>
                        <v-subheader>General</v-subheader>
                        <v-list-tile avatar>
                            <v-list-tile-action>
                                <v-checkbox></v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Notifications</v-list-tile-title>
                                <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile avatar>
                            <v-list-tile-action>
                                <v-checkbox></v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Sound</v-list-tile-title>
                                <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile avatar>
                            <v-list-tile-action>
                                <v-checkbox></v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Auto-add widgets</v-list-tile-title>
                                <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card-text>

                <div style="flex: 1 1 auto;"/>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import LineChart from '../components/charts/LineChart'
  export default {
    components: {LineChart},
    data () {
      return {
        pageTitle: 'Inicio',
        datePicker: null,
        search: '',
        ApiUsersPics: this.$configs.ApiUrl + 'images/users/',
        newPostComment: '',
        snackBar: false,
        createPostDialog: false,
        successMessage: '',
        newPost: {
          title: '',
          content: '',
          user_id: '',
          image: '',
          video: '',
        },
        simpleCards: [
          {
            icon: 'account_circle',
            color: 'warning',
            title: '0 Usuarios',
            subTitle: '0 Nuevos en la última semana'
          },
          {
            icon: 'event',
            color: 'info',
            title: '0 Productos',
            subTitle: '0 Nuevos en la últina semana'
          },
          {
            icon: 'widgets',
            color: 'primary',
            title: '0 Ventas',
            subTitle: '0 Nuevas en la última semana'
          }
        ],
        chartCards: [
          {
            title: 'Ventas',
            subTitle: 'Calculado en los últimos 7 días',
              /* LINE CHART */
            lChart: {
              data: {
                labels: ['1', '2', '3', '4', '5', '6', '7'],
                datasets: [
                  {
                    label: 'Ventas',
                    backgroundColor: '#4FC5EA',
                    data: [10, 30, 62, 49, 50, 20, 89]
                  }
                ]
              },
              options: {
                maintainAspectRatio: false,
                responsive: true,
                legend: {display: false},
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Month'
                    }
                  }],
                  yAxes: [{
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Value'
                    }
                  }]
                }
              },
            },
          },
          {
            title: 'Clientes',
            subTitle: 'Calculado en los últimos 10 días',
            lChart: {
              data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [
                  {
                    label: 'Clientes',
                    backgroundColor: '#9C27B0',
                    data: [10, 11, 15, 25, 36, 57, 58, 60, 80, 85]
                  }
                ]
              },
              options: {
                maintainAspectRatio: false,
                responsive: true,
                legend: {display: false},
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Month'
                    }
                  }],
                  yAxes: [{
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Value'
                    }
                  }]
                }
              },
            },
          },
          {
            title: 'Productos',
            subTitle: 'Calculado en los últimos 15 días',
            lChart: {
              data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
                datasets: [
                  {
                    label: 'Productos',
                    backgroundColor: '#FF9800',
                    data: [10, 30, 40, 38, 55, 67, 50, 70, 85, 90, 105, 120, 135, 145, 160]
                  }
                ]
              },
              options: {
                maintainAspectRatio: false,
                responsive: true,
                legend: {display: false},
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Month'
                    }
                  }],
                  yAxes: [{
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Value'
                    }
                  }]
                }
              },
            },
          }
        ],
      }
    },
    computed: {
      ...mapGetters({
        analytics: 'getAnalytics',
        posts: 'getPosts'
      }),
      filteredPosts: function () {
        return this.posts.newPosts.filter((posts) => {
          return posts.content.toLowerCase().match(this.search);
        });
      },
    },
    created() {
      let vm = this;
      vm.setDashboard();
    },
    methods: {
      setDashboard() {
        let vm = this;
        vm.$Progress.start();
        vm.$store.dispatch('setDashboard')
            .then(response => {
              vm.$Progress.finish();
              vm.setDashboardData();
            })
            .catch(error => {
              vm.$Progress.fail();
            })
      },
      setDashboardData() {
        let vm = this;
        if (vm.analytics.users) {
          vm.simpleCards[0].title = vm.analytics.users.totalUsers + ' Usuarios';
          vm.simpleCards[0].subTitle = vm.analytics.users.newUsers + ' Nuevos en la última semana';
        }
        if (vm.analytics.products) {
          vm.simpleCards[1].title = vm.analytics.products.totalProducts + ' Productos';
          vm.simpleCards[1].subTitle = vm.analytics.products.newProducts + ' Nuevos en la última semana';
        }
        if (vm.analytics.sales) {
          vm.simpleCards[2].title = vm.analytics.sales.totalSales + ' Ventas';
          vm.simpleCards[2].subTitle = vm.analytics.sales.newSales + ' Nuevas en la última semana';
        }
      },
      sendNewComment(postID) {
        let vm = this;
        vm.$Progress.start();

        let authUserID = vm.$store.state.users.authenticatedUser.id;
        let newComment = vm.newPostComment;
        let created_at = new Date(Date.now())
        let user = vm.$store.state.users.authenticatedUser;
        let comment = {
          'post_id': postID,
          'user_id': authUserID,
          'content': newComment,
          'created_at': created_at,
          'user': user
        };
        vm.$store.dispatch('sendPostComment', comment)
            .then(response => {
              vm.$Progress.finish();
              vm.successMessage = '¡Comentario creado exitosamente!';
              vm.snackBar = true;
              vm.newPostComment = '';
            })
            .catch(error => {
              vm.$Progress.fail();
            })
      },
      createNewPost() {
        let vm = this;
        let data = {
            title: vm.newPost.title,
            content: vm.newPost.content,
            user_id: vm.$store.state.users.authenticatedUser.id,
        };
        console.log("my awesome post", data);
        vm.$store.dispatch('sendNewPost', data)
            .then(response => {
              vm.setDashboard();
              vm.$Progress.finish();
              vm.createPostDialog = false;
              vm.successMessage = '¡Post creado exitosamente!';
              vm.snackBar = true;
              vm.newPostComment = '';
            })
            .catch(error => {
              vm.$Progress.fail();
            })
      }
    }
  }
</script>


