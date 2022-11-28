import Link from 'next/link'

export default function IndexPage() {
  return (
    <div>
      Hello World. <Link href="/about">About</Link>
        <button onClick={click}>Click me</button>
    </div>
  )
}

async function click() {
    const text = await fetch("/api/").then(res => res.text());
    alert(text);
}
