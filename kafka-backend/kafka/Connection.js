var kafka = require('kafka-node');
import config from '../config/index';
console.log(`${config.kafkaUrl}`);
function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        var options = {
            // connect directly to kafka broker (instantiates a KafkaClient)
            kafkaHost: `${config.kafkaUrl}:9092`, // THis is the default port of first broker, see its server.properties
            groupId: 'Twitter',
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            sessionTimeout: 15000,
            fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
            protocol: ['roundrobin'],
            fromOffset: 'latest',
            outOfRangeOffset: 'earliest',
            id:'c'

        };
        this.kafkaConsumerConnection = new kafka.ConsumerGroup(options, topic_name);
        this.kafkaConsumerConnection.on('ready', function () { /* // console.log('client ready!')*/ })
        
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client(`${config.kafkaUrl}:2181`); // No need to contain http
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            // console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;