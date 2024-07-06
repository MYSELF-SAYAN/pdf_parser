def transform_conversation(conversation):
        return {
            "question": conversation["question"],  
            "answer": conversation["answer"], 
        }
def pdfEntity(item):
    return {
        "_id": str(item["_id"]),
        "title": item["title"],
        "file": item["file"],
        "fileData": item["fileData"],
        "conversations": [transform_conversation(conv) for conv in item["conversations"]],
    }