import Vue from 'vue';
// import VueRouter from 'vue-router';
import Vuetify from 'vuetify'
import axios from 'axios';
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

axios.defaults.headers.common['Authorization'] = 'Bearer keylAaRRG5gi5SbYU';


var themeConfig = {
    icons: {
        iconfont: 'fa',
    },
    theme: {
        themes: {
            light: {
                primary: '#ff6a03',
                other: '#fff',
                secondary: '#b0bec5',
                anchor: '#8c9eff',
                accent: '#ff6a03'
            },
        },
    },
};

const vuetifyTheme = new Vuetify(themeConfig)

new Vue({
    el: '#scoreboard',
    vuetify: vuetifyTheme,
    data: function() {
        return {
            title: 'Halloween 2019 Scoreboard',
            snackbarTimeout: 6000,
            footer: {
                inset: true,
            },
            teams: [],
            first: 'Stranger Things',
            second: 'Superheroes',
            third: 'Decades',
            overlay: false
        }
    },
    created: function() {
        this.getFromApi();
    },
    methods: {
        getFromApi: function() {
            var _this = this;
            var url = 'https://api.airtable.com/v0/app8J19zlCZ5Ebxwt/Table%201?maxRecords=20&view=Grid%20view';

            this.overlay = true;
            setTimeout(() => {
                axios.get(url).then(function(resp){
                    resp.data.records.forEach(function(record, index){
                        var team = {
                            'points': parseInt(record.fields.costume_score ? record.fields.costume_score : 0) 
                                    + parseInt(record.fields.pin_the_nose_score ? record.fields.pin_the_nose_score : 0) 
                                    + parseInt(record.fields.guess_score ? record.fields.guess_score : 0) 
                                    + parseInt(record.fields.pumpkin_toss_score ? record.fields.pumpkin_toss_score : 0) 
                                    + parseInt(record.fields.mummy_score ? record.fields.mummy_score : 0),
                            'rank1': false,
                            'rank2': false,
                            'rank3': false,
                            'rank': 1,
                            'name': record.fields.team,
                            'costume_score': record.fields.costume_score,
                            'pin_the_nose_score': record.fields.pin_the_nose_score,
                            'guess_score': record.fields.guess_score,
                            'pumpkin_toss_score': record.fields.pumpkin_toss_score,
                            'mummy_score': record.fields.mummy_score,
                        }
    
                        if (!_this.teams[index]) {
                            _this.teams.push(team);
                        } else {
                            _this.teams.splice(index, 1, team);
                        };            
                    });


                    _this.teams.sort(function(a, b){return b.points - a.points});

                    for (var t in _this.teams) {
                        _this.teams[t].rank = parseInt(t) + 1;
                    }


                    if (_this.teams[1].points == _this.teams[0].points) {
                        _this.teams[1].rank = 1;
                    }

                    if (_this.teams[2].points == _this.teams[0].points) {
                        _this.teams[2].rank = 1;
                    } else if (_this.teams[2].points == _this.teams[1].points) {
                        _this.teams[2].rank = 2;
                    }
                    
                    _this.overlay = false;        

                    _this.timeout(20000);
                });
            }, 1000)
        },
        isRank1: function(team) {
            if (team.rank1) {
                return true;
            }

            return false;
        },

        isRank2: function(team) {
            console.log(team.name + ': ' + team.rank2);
            if (team.rank2) {
                return true;
            }

            return false;
        },

        isRank3: function(team) {
            if (team.rank3) {
                return true;
            }

            return false;
        },

        timeout: function(milliseconds) {
            var _this = this;

            setTimeout(function () {
                _this.getFromApi();
            }, milliseconds);
        },
    }
});