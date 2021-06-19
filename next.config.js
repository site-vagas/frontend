module.exports = {
    images: {
        domains: [],
    },

    async headers(){
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: "Referrer-Policy",
                        value: "origin"
                    }
                ]
            }
        ]
    }
}