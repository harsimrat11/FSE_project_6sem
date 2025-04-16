
import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/pistols", name: "Pistols", imageUrl: "/pistols.jpeg" },
	{ href: "/revolvers", name: "Revolvers", imageUrl: "/revolvers.jpeg" },
	{ href: "/shotguns", name: "Shotguns", imageUrl: "/shotguns.jpeg" },
	{ href: "/rifles", name: "Rifles", imageUrl: "/rifles.jpeg" },
	{ href: "/snipers", name: "Snipers", imageUrl: "/snipers.jpeg" },
	{ href: "/ammo", name: "Ammo", imageUrl: "/ammo.jpeg" },
	{ href: "/accessories", name: "Accessories", imageUrl: "/accessories.jpeg" },
];

const HomePage = () => {
	const { fetchAllProducts, products, loading } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen text-white' style={{ background: 'radial-gradient(at top,rgb(49, 123, 138),rgb(1, 0, 20),rgb(0, 0, 0))' }}>



			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Unleash Precision - Elevate Your Firepower
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!loading && products.length > 0 && (
					<FeaturedProducts featuredProducts={products} />
				)}
			</div>
		</div>
	);
};

export default HomePage;
