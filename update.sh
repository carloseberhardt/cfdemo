#! /bin/sh
echo curl -X POST http://nf.local.pcfdev.io/carlos -H "Content-Type: application/json" -d '{"where":"Santa Clara, CA","why":"Cloud Foundry Summit 2016"}'
curl -X POST http://nf.local.pcfdev.io/carlos -H "Content-Type: application/json" -d '{"where":"Santa Clara, CA","why":"Cloud Foundry Summit 2016"}'
