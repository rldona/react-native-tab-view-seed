import React, { Component } from 'react';

import {
  View,
  ListView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import * as themoviedb from '../services/movies-service';
import * as colors from './colors';

import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Historial extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataMovies: null
    };

    themoviedb.getHistorialList().then((historial) => {
      console.log(JSON.parse(historial));

      let historialListLimited = [];
      let limit = 5

      if (JSON.parse(historial).length > 0) {
        for (let i = 0; i < limit; i++) {
          if (typeof JSON.parse(historial)[i] !== 'undefined') {
            historialListLimited.push(JSON.parse(historial)[i]);
          }
        }
      }

      console.log(historialListLimited.length);

      this.setState({
        dataMovies: ds.cloneWithRows(historialListLimited)
      });
    });
  }

  componentWillReceiveProps() {
    themoviedb.getHistorialList().then((historial) => {

      console.log('historial (promise) ', JSON.parse(historial));

      let historialListLimited = [];
      let limit = 5

      if (JSON.parse(historial).length > 0) {
        for (let i = 0; i < limit; i++) {
          if (typeof JSON.parse(historial)[i] !== 'undefined') {
            historialListLimited.push(JSON.parse(historial)[i]);
          }
        }
      }

      if (JSON.parse(historial) === null) {
        this.setState({
          dataMovies: null
        });
      } else {
        this.setState({
          dataMovies: ds.cloneWithRows(JSON.parse(historialListLimited))
        });
      }

    });
  }

  _onSelectMovie(movie) {
    themoviedb.setCurrentMovie(movie);
    themoviedb.getNavigator().push({index: 2, title: 'detail-movie'})
  }

  renderMovieList(movie) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={this._onSelectMovie.bind(this, movie)}>
        <Image
          resizeMode={'cover'}
          style={{minWidth: 300, borderRadius: 3, marginHorizontal: 0, backfaceVisibility: 'hidden'}}
          source={{uri: 'https://image.tmdb.org/t/p/w300/' + movie.backdrop_path}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingLeft: 30, paddingRight: 15, borderBottomWidth: 1, borderBottomColor: colors.getList().primary}}>
            <Icon name="keyboard-arrow-right" size={27} color={colors.getList().white} />
          </View>
        </Image>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, paddingLeft: 15, paddingRight: 15, paddingVertical: 25, minWidth: width-20, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999}}>
          <Text style={{color: colors.getList().white, textAlign: 'center', fontSize: 17}}>{movie.title}</Text>
          <Icon name="keyboard-arrow-right" size={27} color={colors.getList().white} />
        </View>
      </TouchableOpacity>
    );
  }

  renderHistorialList() {
    if (!this.state.dataMovies) {
      return (
        <View>
          <Text style={styles.grid}>VACÍO</Text>
        </View>
      )
    }

    return (
      <View>
        <ListView
          dataSource={this.state.dataMovies}
          renderRow={(rowData) => this.renderMovieList(rowData)}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false} />
      </View>
    )
  }

  renderButtonMore() {
    themoviedb.getHistorialList().then((data) => {
      if (JSON.parse(data).length > 4) {
        return (
          <Text style={styles.viewAll}>VER MÁS</Text>
        );
      } else {
        return null;
      }
    });

    return (
      <Text style={styles.viewAll}>VER MÁS</Text>
    );

  }

  render() {

    const { title } = this.props;

    return (
      <View style={{backgroundColor: colors.getList().primary, paddingBottom: 15, marginTop: 20, marginLeft: 10, marginRight: 10}}>

        <View style={{paddingTop: 0, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
          <Text style={styles.title}>
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              themoviedb.setCurrentTitle('Lo último que has buscado');
              {/*themoviedb.setCurrentType(this.props.type);*/}
              themoviedb.setCurrentCollection('historial');
              themoviedb.getNavigator().push({index: 4, route: 'top-list'});
            }}
            activeOpacity={0.9}>
            {this.renderButtonMore()}
          </TouchableOpacity>
        </View>

        {this.renderHistorialList()}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  grid: {
    textAlign: 'center',
    marginLeft: 0,
    fontWeight: '600',
    marginRight: 0,
    color: '#444',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#444'
  },
  title: {
    fontWeight: '600',
    paddingTop: 5,
    paddingLeft: 5,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 15,
    color: colors.getList().white,
  },
  viewAll: {
    color: colors.getList().app,
    fontSize: 11,
    marginTop: 0,
    marginRight: 0,
    paddingTop: 5,
    paddingBottom: 5,
    minWidth: 80,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.getList().app,
    textAlign: 'center'
  },
});
