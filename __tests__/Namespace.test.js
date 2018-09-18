import Namespace from 'Namespace'

test('fetch all namespaces', done => {
  const namespace = new Namespace()

  namespace.fetch().then(results => {
    console.warn(results)
    results.forEach(r => {
      console.warn(r)
    })
    done()
  })

})

test('fetch one namespace', done => {
  const namespace = new Namespace()

  namespace.fetch('carto').then(results => {
    console.warn(results)
    done()
  })

})