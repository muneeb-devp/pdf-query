# PDF Query Application

Welcome to the PDF Query Application! This application allows users to upload any PDF document and interact with an AI model trained on that document. Users can ask questions, and the AI will provide responses based on the content of the uploaded PDF.

## Demo

## Features

- **PDF Upload**: Users can upload any PDF document.
- **AI Model Training**: The application trains an AI model on the uploaded PDF to understand its content.
- **Contextual Responses**: Users can ask questions, and the AI will respond with answers in the context of the uploaded PDF.
- **Authentication**: Secure authentication is supported via Clerk.
- **Storage**: Uploaded PDFs are stored in Azure Blob Storage.
- **Database**: Drizzle is used as the ORM, and Postgres is the database.
- **Payments**: LemonSqueezy is integrated for handling payments.

## Getting Started

To get started with the PDF Query Application, follow these steps:

1. **Clone the repository**:

```sh
git clone https://github.com/yourusername/pdf-query.git
cd pdf-query
```

2. **Install dependencies**:

```sh
npm install
```

3. **Set up environment variables**:
   Create a `.env` file and add the necessary environment variables for Clerk, Azure Blob Storage, Postgres, and LemonSqueezy.

4. **Run the application**:

```sh
npm start
```

## Usage

1. **Upload a PDF**: Log in and upload a PDF document.
2. **Ask Questions**: Once the AI model is trained, ask any questions related to the content of the PDF.
3. **Receive Answers**: Get contextual answers from the AI based on the uploaded PDF.

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, please open an issue on GitHub or contact us at muneeb.devp@gmail.com

Enjoy using the PDF Query Application!
