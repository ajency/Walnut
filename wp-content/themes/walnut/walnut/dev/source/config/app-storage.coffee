define ['underscore', 'marionette', 'backbone','jquery', 'plugins/SQLitePlugin'], (_, Marionette, Backbone, $, sqlitePlugin)->
    #Access data from local storage using a pre-populated db file

    db = window.openDatabase("walnutapp", "1.0", "WalnutApp DB", 200000)
    #db = window.sqlitePlugin.openDatabase("1", "1.0", "WalnutApp DB", -1);
    console.log 'DB Object: '+db

    db.transaction((tx)->
        console.log 'Pre-populated database'
        # tx.executeSql('DROP TABLE IF EXISTS TEXTBOOK');
        # tx.executeSql('CREATE TABLE IF NOT EXISTS TEXTBOOK (term_id unique, name, slug, term_group, term_order, term_taxonomy_id, taxonomy, description, parent, count, cover_pic, author, classes, subjects, chapter_count)');
        # tx.executeSql('INSERT INTO TEXTBOOK (term_id, name, slug, term_group, term_order, term_taxonomy_id, taxonomy, description, parent, count, cover_pic, author, classes, subjects, chapter_count) VALUES (32, "Art", "art", "0", "0", "32", "textbook", "", "0", "0", "", "", null, null, 0)');
        # tx.executeSql('INSERT INTO TEXTBOOK (term_id, name, slug, term_group, term_order, term_taxonomy_id, taxonomy, description, parent, count, cover_pic, author, classes, subjects, chapter_count) VALUES (33, "English", "english", "0", "0", "32", "textbook", "", "0", "0", "", "", null, null, 0)');
    
    ,(tx,err)->
        console.log("Error processing SQL: "+err);

    ,()->
        console.log("Success!");
    )
           
    

    Backbone.db = db  