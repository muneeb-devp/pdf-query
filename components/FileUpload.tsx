'use client'
import React, { useState } from 'react'
// import { blobServiceClient } from '../lib/azureBlobStorage'
// import { uploadBlobToAzure } from '../lib/azureBlobStorage'
import { Inbox, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { UploadFileResponse, uploadFile } from '@/lib/azureBlobStorage'

type Props = {}

const FileUpload = (props: Props) => {
  const [isUploading, setIsUploading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: async files => {
      const file: File = files[0]

      if (!file) {
        alert('Max allowed file size is 10mb.')
        return
      }

      setIsUploading(true)
      const response: UploadFileResponse = await uploadFile(file)

      if (response.status === 'ok') console.log('File uploaded', response)
      else console.error(response.error)
      setIsUploading(false)
    },
  })

  return (
    <section className='p-2 bg-white rounded-xl'>
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
        })}
      >
        <input {...getInputProps()} />
        <>
          {isUploading ? (
            <>
              <Loader2 className='w-10 h-10 text-blue-600 animate-spin opacity-80' />
              <p className='mt-2 text-sm text-slate-400'> Uploading file...</p>
            </>
          ) : (
            <>
              <Inbox className='w-10 h-10 text-gray-800' />
              <p className='mt-2 text-sm text-slate-400'> Drop PDF Here</p>
            </>
          )}
        </>
      </div>
    </section>
  )
}

export default FileUpload
