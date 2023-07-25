import React, { useState } from "react";
import styles from "../styles/Create.module.css";
import { Web3Button } from "@thirdweb-dev/react";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import useCreatePost from "../lib/useCreatePost";


export default function Create() {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const {mutateAsync: createPost} = useCreatePost()


  console.log(image,title,description,content)

  return (
    <div className={styles.formContainer}>
      <div className={styles.inputContainer}>
        <input
          type="file"
          onChange={(event) => {
            if (event.target.files) {
              setImage(event.target.files[0]);
              console.log({image})
            }
          }}
        />
      </div>

      {/* input for the title */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="title"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className={styles.inputContainer}>
        <textarea
          placeholder="Content"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Web3Button contractAddress={LENS_CONTRACT_ADDRESS}
      contractAbi={LENS_CONTRACT_ABI}
      action={async()=> {
        if(!image) return 

        return await createPost({
        image,
        title,
        description,
        content
        
      })}} > Post</Web3Button>
    </div>
  );
}
