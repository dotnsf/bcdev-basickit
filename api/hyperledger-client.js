//. hyperledger-client.js

var settings = require( './settings' );

const cloudantLib = require( 'cloudant' );
const NS = 'me.juge.bcdev.basickit';
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const useBC = ( settings.cloudant_db ? false : true );
var cloudant = null;
var db = null;

const HyperledgerClient = function() {
  var vm = this;
  vm.businessNetworkConnection = null;
  vm.businessNetworkDefinition = null;

  vm.prepare = (resolved, rejected) => {
    if( useBC ){
      if (vm.businessNetworkConnection != null && vm.businessNetworkDefinition != null) {
        resolved();
      } else {
        console.log('HyperLedgerClient.prepare(): create new business network connection');
        vm.businessNetworkConnection = new BusinessNetworkConnection();
        const cardName = settings.cardName;
        return vm.businessNetworkConnection.connect(cardName)
        .then(result => {
          vm.businessNetworkDefinition = result;
          resolved();
        }).catch(error => {
          console.log('HyperLedgerClient.prepare(): reject');
          rejected(error);
        });
      }
    }else{
      if( db == null ){
        cloudant = cloudantLib( { account: settings.cloudant_username, password: settings.cloudant_password } );
        cloudant.db.get( settings.cloudant_db, function( err, body ){
          if( err ){
            if( err.statusCode == 404 ){
              cloudant.db.create( settings.cloudant_db, function( err, body ){
                if( err ){
                  db = null;
                  rejected( err );
                }else{
                  db = cloudant.db.use( settings.cloudant_db );
                  resolved();
                }
              });
            }else{
              db = null;
              rejected( err );
            }
          }else{
            db = cloudant.db.use( settings.cloudant_db );
            resolved();
          }
        });
      }else{
        resolved();
      }
    }
  };

  //. User
  vm.createUserTx = (user, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        let factory = vm.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction(NS, 'CreateUserTx');
        transaction.id = user.id;
        transaction.password = user.password;
        transaction.name = user.name;
        transaction.role = user.role;

        return vm.businessNetworkConnection.submitTransaction(transaction)
        .then(result => {
          //resolved(result);
          var result0 = {transactionId: transaction.transactionId, timestamp: transaction.timestamp};
          resolved(result0);
        }).catch(error => {
          console.log('HyperLedgerClient.createUserTx(): reject');
          rejected(error);
        });
      }else{
        let transaction = {};
        transaction.id = user.id;
        transaction.password = user.password;
        transaction.name = user.name;
        transaction.role = user.role;

        db.get( user.id, function( err, data ){
          if( err ){
            db.insert( transaction, user.id, function( err, body, header ){
              if( err ){
                rejected( err );
              }else{
                console.log( 'HyperledgerClient.createUserTx(): reject' );
                resolved( body );
              }
            });
          }else{
            transaction['_id'] = data['_id'];
            transaction['_rev'] = data['_rev'];
            db.insert( transaction, function( err, body ){
              if( err ){
                rejected( err );
              }else{
                resolved( body );
              }
            });
          }
        });
      }
    }, rejected);
  };

  vm.updateUserTx = (user, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        let factory = vm.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction(NS, 'UpdateUserTx');
        transaction.id = user.id;
        transaction.password = user.password;
        transaction.name = user.name;
        transaction.role = user.role;

        return vm.businessNetworkConnection.submitTransaction(transaction)
        .then(result => {
          //resolved(result);
          var result0 = {transactionId: transaction.transactionId, timestamp: transaction.timestamp};
          resolved(result0);
        }).catch(error => {
          console.log('HyperLedgerClient.updateUserTx(): reject');
          rejected(error);
        });
      }else{
        let transaction = {};
        transaction.id = user.id;

        db.get( user.id, function( err, data ){
          if( err ){
            db.insert( transaction, user.id, function( err, body, header ){
              if( err ){
                rejected( err );
              }else{
                console.log( 'HyperledgerClient.createUserTx(): reject' );
                resolved( body );
              }
            });
          }else{
            transaction['_id'] = data['_id'];
            transaction['_rev'] = data['_rev'];
            transaction['id'] = data['id'];
            transaction['password'] = data['password'];
            transaction['name'] = data['name'];
            transaction['role'] = data['role'];
            if( user.password ){ transaction.password = user.password };
            if( user.name ){ transaction.name = user.name };
            if( user.role ){ transaction.role = user.role };
            db.insert( transaction, function( err, body ){
              if( err ){
                rejected( err );
              }else{
                resolved( body );
              }
            });
          }
        });
      }
    }, rejected);
  };

  vm.deleteUserTx = (id, resolved, rejected) => {
    vm.prepare(() => {
      if( id == 'admin' ){
        rejected( 'Can not delete admin user.' );
      }else{
        if( useBC ){
          let factory = vm.businessNetworkDefinition.getFactory();
          let transaction = factory.newTransaction(NS, 'DeleteUserTx');
          transaction.id = id;
          return vm.businessNetworkConnection.submitTransaction(transaction)
          .then(result => {
            resolved(result);
          }).catch(error => {
            console.log('HyperLedgerClient.deleteUserTx(): reject');
            rejected(error);
          });
        }else{
          db.get( id, function( err, data ){
            if( err ){
              rejected( err );
            }else{
              db.destroy( id, data._rev, function( err, body ){
                if( err ){
                  rejected( err );
                }else{
                  resolved( body );
                }
              });
            }
          });
        }
      }
    }, rejected);
  };


  vm.createItemTx = (item, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        let factory = vm.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction(NS, 'CreateItemTx');
        //console.log( transaction );
        transaction.id = item.id;
        transaction.user_id = item.user_id;
        transaction.body = item.body;
        transaction.datetime = ( item.datetime ? item.datetime : new Date() );

        //console.log( transaction );

        return vm.businessNetworkConnection.submitTransaction(transaction)
        .then(result => {
          //resolved(result);
          var result0 = {transactionId: transaction.transactionId, timestamp: transaction.timestamp};
          resolved(result0);
        }).catch(error => {
          console.log('HyperLedgerClient.createItemTx(): reject');
          rejected(error);
        });
      }else{
        let transaction = {};
        transaction.id = item.id;
        transaction.user_id = item.user_id;
        transaction.body = item.body;
        transaction.datetime = ( item.datetime ? item.datetime : new Date() );

        db.get( item.id, function( err, data ){
          if( err ){
            db.insert( transaction, item.id, function( err, body, header ){
              if( err ){
                rejected( err );
              }else{
                console.log( 'HyperledgerClient.createItemTx(): reject' );
                resolved( body );
              }
            });
          }else{
            transaction['_id'] = data['_id'];
            transaction['_rev'] = data['_rev'];
            db.insert( transaction, function( err, body ){
              if( err ){
                rejected( err );
              }else{
                resolved( body );
              }
            });
          }
        });
      }
    }, rejected);
  };

  vm.updateItemTx = (item, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        let factory = vm.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction(NS, 'UpdateItemTx');
        //console.log( transaction );
        transaction.id = item.id;
        transaction.user_id = item.user_id;
        transaction.body = item.body;
        transaction.datetime = ( item.datetime ? item.datetime : new Date() );

        //console.log( transaction );

        return vm.businessNetworkConnection.submitTransaction(transaction)
        .then(result => {
          //resolved(result);
          var result0 = {transactionId: transaction.transactionId, timestamp: transaction.timestamp};
          resolved(result0);
        }).catch(error => {
          console.log('HyperLedgerClient.updateItemTx(): reject');
          rejected(error);
        });
      }else{
        let transaction = {};
        transaction.id = item.id;
        transaction.user_id = item.user_id;
        transaction.body = item.body;
        transaction.datetime = ( item.datetime ? item.datetime : new Date() );

        db.get( item.id, function( err, data ){
          if( err ){
            db.insert( transaction, item.id, function( err, body, header ){
              if( err ){
                rejected( err );
              }else{
                console.log( 'HyperledgerClient.updateItemTx(): reject' );
                resolved( body );
              }
            });
          }else{
            transaction['_id'] = data['_id'];
            transaction['_rev'] = data['_rev'];
            transaction['id'] = data['id'];
            transaction['user_id'] = data['user_id'];
            transaction['body'] = data['body'];
            transaction['datetime'] = data['datetime'];
            if( item.user_id ){ transaction.user_id = item.user_id };
            if( item.body ){ transaction.body = item.body };
            if( item.datetime ){ transaction.datetime = item.datetime };
            db.insert( transaction, function( err, body ){
              if( err ){
                rejected( err );
              }else{
                resolved( body );
              }
            });
          }
        });
      }
    }, rejected);
  };

  vm.deleteItemTx = (id, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        let factory = vm.businessNetworkDefinition.getFactory();
        let transaction = factory.newTransaction(NS, 'DeleteItemTx');
        transaction.id = id;
        return vm.businessNetworkConnection.submitTransaction(transaction)
        .then(result => {
          resolved(result);
        }).catch(error => {
          console.log('HyperLedgerClient.deleteItemTx(): reject');
          rejected(error);
        });
      }else{
        db.get( id, function( err, data ){
          if( err ){
            rejected( err );
          }else{
            db.destroy( id, data._rev, function( err, body ){
              if( err ){
                rejected( err );
              }else{
                resolved( body );
              }
            });
          }
        });
      }
    }, rejected);
  };


  vm.getUserForLogin = (id, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        return vm.businessNetworkConnection.getParticipantRegistry(NS + '.User')
        .then(registry => {
          return registry.resolve(id);
        }).then(user => {
          resolved(user);
        }).catch(error => {
          console.log('HyperLedgerClient.getUserForLogin(): reject');
          rejected(error);
        });
      }else{
        db.get( id, function( err, user ){
          if( err ){
            rejected(err);
          }else{
            resolved(user);
          }
        });
      }
    }, rejected);
  };

  vm.getUser = (id, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        return vm.businessNetworkConnection.getParticipantRegistry(NS + '.User')
        .then(registry => {
          return registry.resolve(id);
        }).then(user => {
          delete user['password'];
          resolved(user);
        }).catch(error => {
          console.log('HyperLedgerClient.getUser(): reject');
          rejected(error);
        });
      }else{
        db.get( id, function( err, user ){
          if( err ){
            rejected(err);
          }else{
            delete user['password'];
            resolved(user);
          }
        });
      }
    }, rejected);
  };

  vm.getAllUsers = ( resolved, rejected ) => {
    vm.prepare(() => {
      if( useBC ){
        return vm.businessNetworkConnection.getParticipantRegistry(NS + '.User')
        .then(registry => {
          return registry.getAll();
        })
        .then(users0 => {
          var users = [];
          users0.forEach( function( element ){
            if( element.id && element.password && ( element.role || element.role === 0 ) ){
              delete element.password;
              users.push( { id: element.id, name: element.name, role: element.role } );
            }
          });
          resolved(users);
        }).catch(error => {
          console.log('HyperLedgerClient.getAllUsers(): reject');
          rejected(error);
        });
      }else{
        //. User だけを取り出す
        db.list( { include_docs: true }, function( err, body ){
          if( err ){
            rejected(err);
          }else{
            var users = [];
            body.rows.forEach( function( element ){
              if( element.id && element.doc && element.doc.password && ( element.doc.role || element.doc.role === 0 ) ){
                delete element.doc.password;
                users.push( element.doc );
              }
            });
            resolved(users);
          }
        });
      }
    }, rejected);
  };


  vm.getItem = (id, resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        return vm.businessNetworkConnection.getAssetRegistry(NS + '.Item')
        .then(registry => {
          return registry.resolve(id);
        }).then(message => {
          resolved(message);
        }).catch(error => {
          resolved(null);
        });
      }else{
        db.get( id, function( err, item ){
          if( err ){
            rejected(err);
          }else{
            resolved(item);
          }
        });
      }
    }, rejected);
  };

  vm.getAllItems = (resolved, rejected) => {
    vm.prepare(() => {
      if( useBC ){
        return vm.businessNetworkConnection.getAssetRegistry(NS + '.Item')
        .then(registry => {
          return registry.getAll();
        })
        .then(items => {
          resolved(items);
        }).catch(error => {
          console.log('HyperLedgerClient.getAllItems(): reject');
          rejected(error);
        });
      }else{
        //. Item だけを取り出す
        db.list( { include_docs: true }, function( err, body ){
          if( err ){
            rejected(err);
          }else{
            var items = [];
            body.rows.forEach( function( element ){
              if( element.id && element.body ){
                items.push( { id: element.id, user_id: element.user_id, body: element.body, datetime: element.datetime } );
              }
            });
            resolved(items);
          }
        });
      }
    }, rejected);
  };
}

module.exports = HyperledgerClient;
