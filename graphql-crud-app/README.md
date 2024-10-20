docker exec -it mongo mongosh -u root -p example --authenticationDatabase admin
use nextjs_mongo
db.items.find()