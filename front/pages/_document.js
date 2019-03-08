import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render () {
        return (
            <html>
                <Head>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                    <meta charSet='utf-8' />
                    <link rel='stylesheet' type='text/css' href='/static/styles.css' />
                </Head>
                <body>
                    <div id="initLoader" className="loader fullScreen">
                        <div className="warpper">
                            <div className="inner"></div>
                            <div className="text">LOADING</div>
                        </div>
                    </div>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}
