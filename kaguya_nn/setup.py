from setuptools import setup

setup(
    name="kaguya_nn",
    version="0.1.0",
    install_requires=[
        "doit",
        "pandas"
    ],
    packages=["kaguya_nn"],
    package_data={"kaguya_nn": ["py.typed"]},
    extras_require={
        "dev": [
            "pytest",
            "black",
            "pytest-cov",
            "pytest-benchmark",
            "pytest-mypy",
            "mypy",
        ]
    },
)
