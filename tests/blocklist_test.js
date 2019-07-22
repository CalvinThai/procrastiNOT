var assert = require('chai').assert;
var BlockList = require('../js/blocklist');


/*Test suite */
function Test() {


    describe('Block-List Test:', function() {
        describe('Creating an empty block list without loading user data', function() {
			var block_list;
	       	// Before every test, reconnect to mocked database
	        beforeEach(function(done) {
				block_list = new BlockList();
				done();
	        });

			it('Should create an empty array of blocked sites', function(done) {
				assert.equal(0, block_list.getBlockedSites().length);
				done();
			});

		});

        describe('Adding a string to an instantiated block list', function() {

			var block_list;
			var test_string = "facebook.com";
			var test_string_two = "google.com";

	       	// Before every test, reconnect to mocked database
	        beforeEach(function(done) {
				block_list = new BlockList();
				done();
	        });

            it('without specifing the index should add it to the end of the array', function(done) {
            	block_list.updateBlockedSite(test_string);
            	assert.equal(block_list.getBlockedSites()[0], test_string);
				block_list.updateBlockedSite(test_string_two);
				assert.equal(block_list.getBlockedSites()[1], test_string_two);
				done();
            });

			it('while specifying the index should add it to the index position', function(done) {
            	block_list.updateBlockedSite(test_string);
            	assert.equal(block_list.getBlockedSites()[0], test_string);
				block_list.updateBlockedSite(test_string_two, 0);
				assert.equal(block_list.getBlockedSites()[0], test_string_two);
				done();
            });

        });

        describe('Removing a string to an populated block list', function() {

			var block_list;
			var test_string = "facebook.com";
			var test_string_two = "google.com";
			var test_string_three = "reddit.com";

	       	// Before every test, reconnect to mocked database
	        beforeEach(function(done) {
				block_list = new BlockList();
            	block_list.updateBlockedSite(test_string);
				block_list.updateBlockedSite(test_string_two);
				block_list.updateBlockedSite(test_string_three);
				done();
	        });

            it('by the index should remove the object at the given index', function(done) {
            	block_list.removeBlockedSiteByIndex(1);
            	assert.notEqual(block_list.getBlockedSites()[1], test_string_two);
				done();
            });

			it('by the string should remove the object with the given string', function(done) {
            	block_list.removeBlockedSiteByString(test_string_two);
            	assert.notEqual(block_list.getBlockedSites()[1], test_string_two);
				done();
            });

        });

        describe('Sites added to the blocklist should be blocked when the block list is passed the site url', function() {

			var block_list;
			var test_string = "facebook.com";
			var test_string_two = "google.com";
			var test_string_three = "reddit.com/r/compsci";

	       	// Before every test, reconnect to mocked database
	        beforeEach(function(done) {
				block_list = new BlockList();
            	block_list.updateBlockedSite(test_string);
				block_list.updateBlockedSite(test_string_two);
				block_list.updateBlockedSite(test_string_three);
				done();
	        });

			it('Should block strings that match exactly', function(done) {
				assert.equal(true, block_list.isBlocked(test_string));
				done();
			});
			it('Should block strings that match the same domain but have further nested navigation', function(done) {
				assert.equal(true, block_list.isBlocked(test_string + "/some/further/path"));
				done();
			});
			it('Should not block substrings if they are not the same domain', function(done) {
				var superstring = "reddit.com/r/compscijobs"; //Checking /r/compsci against /r/compscijobs
				assert.equal(false, block_list.isBlocked(superstring));
				done();
			});
		});

        describe('Saving data to chrome storage', function() {

		});
    });
}


module.exports = Test;